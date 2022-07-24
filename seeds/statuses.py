from flask_seeder import Seeder, Faker, generator
import os

from app.models import Statuses
from app.gens import ReadCSV
     
class StatusSeeder(Seeder):
  def __init__(self, db=None):
    super().__init__(db=db)
    self.priority = 25

  def run(self):
    reader = ReadCSV('seeds' + os.sep + 'statuses.csv')
    try: 
        while True:
            status = reader.generate()
            data = Statuses(**status)
            self.db.session.add(data)
    except: pass
   