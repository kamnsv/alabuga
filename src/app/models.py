from . import db

class SeedModel:
    def __init__(self, **data):
        self.data = data
        for k, v in data.items():
            self[k] = v
        
    def __str__(self):
        s = ', '.join([f'{k}={v}' for k, v in self.data.items()])
        return s

class Statuses(db.Model, SeedModel):
    id = db.Column(db.Integer, 
                   primary_key=True)
    status = db.Column(db.String(128), 
                     nullable=False, 
                     unique=True)
    salary = db.Column(db.Integer, 
                       unique=True)
    
    def to_json(self):
        return {
            'id': self.id,
            'status': self.status,
            'salary': self.salary,
        }
        
class Citizens(db.Model, SeedModel):
    id = db.Column(db.Integer, 
                   primary_key=True)
    name = db.Column(db.String(128), 
                     nullable=False)
    age  = db.Column(db.Integer)
    boss = db.Column(db.Integer, 
                     nullable=True)
    id_status = db.Column(db.Integer, 
                          db.ForeignKey('statuses.id'), 
                          nullable=False)
    def to_json(self):
        item = Citizens.query.get(self.boss)
        return {
            'id': self.id,
            'name': self.name,
            'age': self.age,
            'Statuses.id__status': self.id_status,
            'Statuses.status': Statuses.query.get(self.id_status).status,
            'Statuses.salary': Statuses.query.get(self.id_status).salary,
            'Citizens.id__boss': self.boss,
            'Citizens.name': 'Нет' if item is None else item.name 
        }
