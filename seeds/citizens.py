from flask_seeder import Seeder, Faker, generator
from app.models import Citizens

class CitizensSeeder(Seeder):
  def __init__(self, db=None):
    super().__init__(db=db)
    self.priority = 10
    
  def run(self):

    faker = Faker(
      cls=Citizens,
      init={
        'name': generator.Name(),
        'age' : generator.Integer(start=14, end=100),
      }
    )

    for citizens in faker.create(500):
      self.db.session.add(citizens)
     