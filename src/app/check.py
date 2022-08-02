from . import models
from .models import Statuses, Citizens

def can_delete(col, row):

    col = col.title()
    
    if error := access_col(col):
        return error
    
    if 'Statuses' == col:
        if error := status_del(row):
            return error
            
    if 'Citizens' == col:
        if error := citizen_del(row):
            return error

def status_del(row):
    # сколько людей с таким статусом
    count_citizens = Citizens.query.filter(Citizens.id_status==row).count()
    if count_citizens: 
        return 'Статус удалить нельзя, пока есть горожане с таким статусом'
    
def citizen_del(row):
    # у скольки людей он начальник
    count_subw = Citizens.query.filter(Citizens.boss==row).count()
    if count_subw: 
        return 'Горожанина удалить нельзя, пока он у кого-то начальник'

   
def check_data(col, data, row=None):
    
    col = col.title()
    
    if error := access_col(col):
        return error
    
    if not data: return 'Данные не найдены'
    
    if error := valid_update(col, row):
        return error
    
    if 'Statuses' == col:
        if error := status_data(data, row):
            return error
    
    if 'Citizens' == col:
        if error := citizen_data(data, row):
            return error
        
def access_col(col): # общая проверка на название модели и тип
    
    if col not in ('Statuses', 'Citizens'): 
        return f'Коллеция {col} не найдена'
    
def valid_update(col, row=None):
    if row is None: return None
    
    model = getattr(models, col)
    data = model.query.get(row)
    if data is None:
        return 'Данные для обновления не найдены'

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
    id_status = int(id_status)
    
    # проверка типов boss
    boss = str(data.get('boss'))
    if not boss.isdigit() and boss is not None: return 'Не корректный тип данных "boss"'
    
            
    #проверка на age
    age = str(data.get('age'))
    if not age.isdigit(): return 'Возраст должен быть положительным целым числом'
    age = int(age)
    if age <=0: return 'Возраст должен быть положительным целым числом'
    
    join_status_citizen = Statuses.query.join(Citizens, Statuses.id==Citizens.id_status)
    
    
    # проверка: boss должен быть выше по иерархии на ранг
        
    def check_boss():
    
        status_boss = join_status_citizen.filter(Citizens.id==boss).all()
        if not len(status_boss):
            return 'Заданный начальник не найден'
        boss_data = status_boss[0]
        
        selected_status = Statuses.query.get(id_status)
        
        if selected_status.salary > boss_data.salary:
            return 'Начальник должен иметь статус выше подчиненного'
            
        
        # Статусы должны быть соседними по иерархии
        table_hierarchy = join_status_citizen.group_by(Statuses.id).order_by(Statuses.salary).all()
        
        for j, e in enumerate(table_hierarchy):
            print(id_status, e.to_json(), e.id, id_status == e.id)
            if id_status == e.id:
                if table_hierarchy[j+1].id != boss_data.id:
                    return 'Начальник должен превышать на один ранг'
                else: return None  
        
    # Добавление   
    if row is None: 
        # Если босс не задан то может быть любой статус
        if not boss: return None
        return check_boss()
    
    else: # правка уже существующего горожанина
        citizen = Citizens.query.get(row)
        count_subw = Citizens.query.filter(Citizens.boss==row).count()
        if citizen.id_status == id_status and citizen.boss != boss:
            # проверка нового начальника
            if not boss: return None
            # какой статус может иметь новый начальник
            # Статусы горожанина и начальника должны быть соседними по иерархии и начальник выше
            table_hierarchy = join_status_citizen.group_by(Statuses.id).order_by(Statuses.salary).all()
            status_boss = None
            for j, e in enumerate(table_hierarchy):
                if citizen.id_status == e.id:
                    if len(table_hierarchy) != j + 1:
                        status_boss = table_hierarchy[j + 1]
            
            if status_boss is None and boss is None:
                return None # верно, не дожно быть начальника у самого главного
            
            if status_boss is None:
                return 'Горожанин имеет максимальный статус и начальника иметь не может'
            
            
            # определяем статус нового начальника
            citizen_boss = Citizens.query.get(boss)
            
            if citizen_boss.id_status != status_boss.id:
                a = Statuses.query.get(citizen.id_status).status
                b = Statuses.query.get(citizen_boss.id_status).status
                c = Statuses.query.get(status_boss.id).status
                return f'У "{a}" не может быть начальник "{b}", может быть только "{c}"'
            
        elif citizen.id_status != id_status and citizen.boss == boss:
            # проверка нового статуса
            # менять статус нельзя если есть подчиненые
            
            if count_subw > 0: 
                return f'Менять статус нельзя если есть подчиненые, сейчас их {count_subw}'
            
            # если нет начальника и подчиненных то статус может быть любой
            if not citizen.boss: return None# нет начальника

        else: # проверка начальника и статуса
            if count_subw > 0: 
                return f'Менять статус нельзя если есть подчиненые, сейчас их {count_subw}'           
            
            # нет подчиненных
            if not boss: return None # нет начальника
            
            # начальник должен быть на ранг выше    
            return check_boss()               