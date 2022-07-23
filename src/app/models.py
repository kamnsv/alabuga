from . import db

class Works(db.Model):
    id = db.Column(db.Integer, 
                   primary_key=True)
    work = db.Column(db.String(128), 
                     nullable=False, 
                     unique=True)

class Statuses(db.Model):
    id = db.Column(db.Integer, 
                   primary_key=True)
    name = db.Column(db.String(128), 
                     nullable=False, 
                     unique=True)
    lvl = db.Column(db.Integer)
    coef = db.Column(db.Float)
    
class Jobs(db.Model):
    id = db.Column(db.Integer, 
                   primary_key=True)
    rate = db.Column(db.Float)
    id_work = db.Column(db.Integer, db.ForeignKey('works.id'), nullable=False)
    id_boss = db.Column(db.Integer, nullable=True)
    
    def to_json(self):
        return {
            'id': self.id,
            'coef': self.coef
        }
           
class Citizens(db.Model):
    id = db.Column(db.Integer, 
                   primary_key=True)
    name = db.Column(db.String(128), 
                     nullable=False, 
                     unique=True)
    born = db.Column(db.DateTime)
    id_status = db.Column(db.Integer, db.ForeignKey('statuses.id'), nullable=False)
    id_job = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=True)
    
    

