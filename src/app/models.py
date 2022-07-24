from . import db

class SeedModel:
    def __init__(self, **data):
        self.data = data
        for k, v in data.items():
            self[k] = v
        
    def __str__(self):
        s = ', '.join([f'{k}={v}' for k, v in self.data.items()])
        return s

class Works(db.Model, SeedModel):
    id = db.Column(db.Integer, 
                   primary_key=True)
    work = db.Column(db.String(128), 
                     nullable=False, 
                     unique=True)
    rate = db.Column(db.Integer)                 
    def to_json(self):
        return {
            'id': self.id,
            'work': self.work,
            'rate': self.rate
        }
        
class Statuses(db.Model, SeedModel):
    id = db.Column(db.Integer, 
                   primary_key=True)
    status = db.Column(db.String(128), 
                     nullable=False, 
                     unique=True)
    lvl = db.Column(db.Integer)
    coef = db.Column(db.Float)
    
    def to_json(self):
        return {
            'id': self.id,
            'status': self.status,
            'lvl': self.lvl,
            'coef': self.coef,
        }
class Citizens(db.Model, SeedModel):
    id = db.Column(db.Integer, 
                   primary_key=True)
    name = db.Column(db.String(128), 
                     nullable=False)
    age = db.Column(db.Integer)
    
    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'age': self.age,
        }

class Jobs(db.Model):
    id = db.Column(db.Integer, 
                   primary_key=True)
    id_work = db.Column(db.Integer, 
                        db.ForeignKey('works.id'), 
                        nullable=False)
    id_citizen = db.Column(db.Integer, 
                            db.ForeignKey('citizens.id'),
                            nullable=False)
    
    def to_json(self):
        return {
            'id': self.id,
            'coef': self.coef
        }
        
class Bosses(db.Model):
    id = db.Column(db.Integer, 
                   primary_key=True)
    id_citizen = db.Column(db.Integer, 
                            db.ForeignKey('citizens.id'),
                            nullable=False)
    id_job = db.Column(db.Integer, 
                        db.ForeignKey('jobs.id'), 
                        nullable=False)

class Hierarchy(db.Model):
    id = db.Column(db.Integer, 
                   primary_key=True)
    id_citizen = db.Column(db.Integer, 
                            db.ForeignKey('citizens.id'),
                            nullable=False)
    id_status = db.Column(db.Integer, 
                        db.ForeignKey('statuses.id'), 
                        nullable=False)