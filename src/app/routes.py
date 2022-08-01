from flask import jsonify, render_template, session, request, abort, redirect
from flask_mail import Mail, Message
import os
import random
import functools
from sqlalchemy import exc

from . import create_app, db
from . import models
from .models import Statuses, Citizens
from .check import check_data, can_delete
 
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
    if error_delete := can_delete(col.title(), i):
        return error_delete, 400
    try:    
        db.session.delete(data)
        db.session.commit()
    except Exception as e:
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