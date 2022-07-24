from flask_seeder import Seeder, Faker, generator
import os

from app.models import Works
from app.gens import ReadLines
     
class WorksSeeder(Seeder):
  def __init__(self, db=None):
    super().__init__(db=db)
    self.priority = 20

  def run(self):
    faker = Faker(
      cls=Works,
      init={
        'work': ReadLines('seeds' + os.sep + 'works.txt'),
        'rate': generator.Integer(start=100, end=1000000),
      }
    )
    try: 
        while True:
            for work in faker.create(1):
                self.db.session.add(work)
    except: pass