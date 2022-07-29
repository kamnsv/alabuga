from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_seeder import FlaskSeeder
from config import config

db = SQLAlchemy()
migrate = Migrate() 

def create_app(config_name='default'):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)
    
    db.init_app(app)
    
    with app.app_context():
        if 'sqlite' == db.engine.url.drivername:
            migrate.init_app(app, db, render_as_batch=True)
        else:
            migrate.init_app(app, db)
    
    seeder = FlaskSeeder()
    seeder.init_app(app, db)
    
    return app