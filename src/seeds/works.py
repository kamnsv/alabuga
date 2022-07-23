from flask_seeder import Seeder, Faker, generator
from app.models import Works
'''
class WorksSeeder(Seeder):
  def __init__(self, db=None):
    super().__init__(db=db)
    self.priority = 20

  def run(self):

    faker = Faker(
      cls=Works,
      init={
        'work': generator.Name(),
      }
    )

    for work in faker.create(500):
      self.db.session.add(work)
     '''