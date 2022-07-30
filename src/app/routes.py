from flask import jsonify, render_template, session, request, abort, redirect
from flask_mail import Mail, Message
import os
import random
import functools
from sqlalchemy import exc

from . import create_app, db
from . import models
from .models import Statuses, Citizens

app = create_app(os.getenv('FLASK_CONFIG') or 'default')
mail = Mail(app)
    
def send_email(theme, email, txt):
    msg = Message(theme, recipients=[email])
    msg.html = f'<p>{txt}</p>'
    try:
        mail.send(msg)
    except Exception as e:
        print(e)
        return False
    return True
       
@app.route('/mail/<string:email>')
def mail_send(email):
    session.clear()
    session['email'] = email
    session['code'] = random.randrange(1000, 10000)
    txt = 'Введите код для входа: <b>%s</b>' % session['code']
    if send_email("Авторизация", email, txt):
        return 'ok', 200 
    return abort(403)

@app.route('/auth/<int:code>')
def auth_user(code):
    if session.get('code', None) is None: return 'invalid', 403
    if session.pop('code') == code:
        session['user'] = session['email'].split('@')[0]
        return 'ok', 200 
    return abort(403)

    
def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if session.get('user'):
            print(session.get('user'))
            return view(**kwargs)
        return abort(401)
    return wrapped_view
   
    
@app.route("/api/<string:col>", methods=["GET"])
@login_required
def get_all(col):
    if not hasattr(models, col.title()):
        return f'Коллеция {col.title()} не найдена', 400
    model = getattr(models, col.title())
    data = model.query.all()
    return jsonify([item.to_json() for item in data])


@app.route("/api/<string:col>/<int:i>", methods=["GET"])
@login_required
def get_data(col, i):
    if not hasattr(models, col.title()): 
        return f'Коллеция {col.title()} не найдена', 400
    model = getattr(models, col.title())
    data = model.query.get(i)
    if data is None:
        return f'Данные не найдены', 400
    return jsonify(data.to_json())


@app.route("/api/<string:col>/<int:i>", methods=["DELETE"])
@login_required
def delete_data(col, i):
    if not hasattr(models, col.title()): 
        return f'Коллеция {col.title()} не найдена', 400
    model = getattr(models, col.title())
    data = model.query.get(i)
    if data is None:
        return f'Данные для удаления не найдены', 400
    try:     
        db.session.delete(data)
        db.session.commit()
    except exc.IntegrityError as e:
        if 'ForeignKeyViolation' in str(e): 
            return 'Сначала нужно удалить зависимости из дуругих таблиц', 400
        else:
            return e, 400
    return 'ok', 200


@app.route('/api/<string:col>', methods=['POST'])
@login_required
def create_data(col):
    
    error_data = check_data(col.title(), request.json)
    if error_data:
        return error_data, 400
        
    model = getattr(models, col.title())
    data = model(**request.json)
    db.session.add(data)
    db.session.commit()
    return jsonify(data.to_json()), 200


@app.route('/api/<string:col>/<int:i>', methods=['PUT'])
@login_required
def update_data(col, i):
   
    error_data = check_data(col.title(), request.json, i)
    if error_data:
        return error_data, 400
        
    model = getattr(models, col.title())
    
    data = model.query.get(i)
    if data is None:
        return f'Данные для обновления не найдены', 400
    for k, v in request.json.items():
        if hasattr(data, k):
            setattr(data, k, v)
    db.session.commit()
    return jsonify(data.to_json())
    
@app.errorhandler(404)
def page_not_found(e):
    if '/logout' == request.path:
        session.clear()
        return redirect('/')
    return render_template('app.html', user=session.get('user')) 
    
    
def check_data(col, data, row=None):

    if not data: return 'Данные не найдены'

    if not hasattr(models, col.title()): return f'Коллеция {col.title()} не найдена'
    
    model = getattr(models, col)
   
    if 'Statuses' == col:
        
        # проверка данных
        for i in ('status', 'salary'):
            val = data.get(i, None)
            if '' == val or val is None:
                return f'Пустое значение для поля "%s"' % {'status': 'Статус', 'salary': 'Доход'}[i]
        
        #проверка на salary
        salary = str(data.get('salary'))
        if not salary.isdigit(): return 'Доход должен быть положительным целым числом'
        salary = int(salary)
        if salary <=0: return 'Доход должен быть положительным целым числом'
        
        
        
        # Добавление   
        if row is None: 
        
            # на уникальность
            
            status = str(data.get('status'))
            if Statuses.query.filter_by(status=status).filter(Statuses.id!=row).count():
                return f'Статус "{status}" уже есть в таблице статусов'
                
            
            if Statuses.query.filter_by(salary=salary).filter(Statuses.id!=row).count():
                return 'Доход должен быть уникальным для статуса, т.к. по нему выстраивается иерархия'
            return
        
        
        # Правка: проверка иерархии
        
        # сколько людей с таким статусом
        
        join_status_citizen = Statuses.query.join(Citizens, Statuses.id==Citizens.id_status)
        
        count_subw = join_status_citizen.filter(Statuses.id==row).count()
        
        # статус свободен для перемещения по иерархии
        if not count_subw: return False
        
        # нужно проверить salary, сумма должен быть между соседними статусами
        # создаем подтаблицу со статусами у которых есть люди(зависисмые) и сортитруем по зарплате
        
        table_hierarchy = join_status_citizen.group_by(Statuses.id).order_by(Statuses.salary).all()
        
        a, b = None, None
        for j, e in enumerate(table_hierarchy):
            if e.id == row:
                a = table_hierarchy[j-1] if j > 0 else None
                b = table_hierarchy[j+1] if j < len(table_hierarchy)-1 else None

        if a is not None and a.salary >= salary:
            return f'Доход не может быть меньше {a.salary} , чем у статуса "{a.status}" ниже по иерархии' 
            
        if b is not None and b.salary <= salary:
            return f'Доход не может быть больше {b.salary}, чем у статуса "{b.status}" выше по иерархии'  
    
    if 'Citizens' == col: # проверка на иерархию
        ...
        # проверка данных
        #for i in ('name', 'age', 'id_status'):
         #   val = data.get(i, None)
          #  if '' == val or val is None:
           #     return f'Пустое значение для поля "%s"' % {'name': 'Имя', 
            #                                               'age': 'Возраст', 
             #                                              'id_status': 'Статус'}[i]
        
        
    return None    
        
        