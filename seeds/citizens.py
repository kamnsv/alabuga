from flask_seeder import Seeder, Faker, generator
from app.models import Citizens, Statuses
import os 
import random

class GeneratorHierarchy(generator.Generator):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.gen = self.generator()
 
        
    def generator(self):
        hierarchy = 1
        for s in Statuses.query.order_by(Statuses.salary.desc()):
            for i in range(hierarchy):
                status = s.id
                yield status
            hierarchy *= 2
        else:
            yield status
            
    def generate(self):
        return next(self.gen)


class GeneratorBoss(generator.Generator):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.gen = self.generator()     
        
    def generator(self):
        n = 1
        bosses = []
        while True:
            
            for _ in range(n):
                yield random.choice(bosses) if len(bosses) else 0
                         
            bosses = list(range(n, 2*n))    
            n *= 2
 
    def generate(self):
        return next(self.gen)
        
        
class CitizensSeeder(Seeder):
  def __init__(self, db=None):
    super().__init__(db=db)
    self.priority = 10
    
  def run(self):
    count = os.getenv('COUNT_CITIZENS') or 500
    faker = Faker(
      cls=Citizens,
      init={
        'name': generator.Name(),
        'age' : generator.Integer(start=14, end=100),
        'id_status': GeneratorHierarchy(),
        'boss': GeneratorBoss(),
      }
    )

    for citizens in faker.create(count):
      self.db.session.add(citizens)
     