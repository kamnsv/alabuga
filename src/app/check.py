from . import models
from .models import Statuses, Citizens

def check_data(col, data, row=None):
    
    if error := common_data(col, data):
        return error
    
    if 'Statuses' == col.title():
        if error := status_data(data, row):
            return error
    
    if 'Citizens' == col.title():
        if error := citizen_data(data, row):
            return error
        
def common_data(col, data): # общая проверка на название модели и тип
    if not data: return 'Данные не найдены'

    if not hasattr(models, col.title()): return f'Коллеция {col.title()} не найдена'
    
    return None

def check_isna(data, fileds): # проверка на пустое значение
    for i in fileds:
        val = data.get(i, None)
        if '' == val or val is None:
            return f'Пустое значение для поля "%s"' % fileds[i]
        
def status_data(data, row=None):
    
    if error := check_isna(data, {'status': 'Статус', 'salary': 'Доход'}):
        return error
    
    
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
    
    join_status_citizen = Statuses.query.join(Citizens, Statuses.id==Citizens.id_status)
    
    # сколько людей с таким статусом
    
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
    

def citizen_data(data, row=None):

    if error := check_isna(data, {'name': 'Имя', 'age': 'Возраст', 'id_status': 'Статус'}):
        return error
        
        
    # проверка типов id_status
    id_status = str(data.get('id_status'))
    if not id_status.isdigit(): return 'Не корректный тип данных "id_status"'
    
    # проверка типов boss
    boss = str(data.get('boss'))
    if not boss.isdigit() and boss is not None: return 'Не корректный тип данных "boss"'
    
            
    #проверка на age
    age = str(data.get('age'))
    if not age.isdigit(): return 'Возраст должен быть положительным целым числом'
    age = int(age)
    if age <=0: return 'Возраст должен быть положительным целым числом'
    

    # Добавление   
    if row is None: 
        # Если босс не задан то может быть любой статус
        if boss is None: return None
    
        # проверка: boss должен быть выше по иерархии на одно звено
        
        join_status_citizen = Statuses.query.join(Citizens, Statuses.id==Citizens.id_status)
        
        status_boss = join_status_citizen.filter(Citizens.id==boss).all()
        if not len(status_boss):
            return 'Начальник должен иметь статус выше подчиненного'
        boss_data = status_boss[0]
        
        selected_status = Statuses.query.get(id_status)
        
        if selected_status.salary > boss_data.salary:
            return 'Начальник должен иметь статус выше подчиненного'
            
        
        # Статусы должны быть соседними по иерархии
        table_hierarchy = join_status_citizen.group_by(Statuses.id).order_by(Statuses.salary).all()
        
        for j, e in enumerate(table_hierarchy):
            if id_status == e.id:
                if table_hierarchy[j+1].id != boss_data.id:
                    return 'Начальник должен превышать на один ранг'
                else: return None
    
    else: # правка уже существующего горожанина
        ...
        