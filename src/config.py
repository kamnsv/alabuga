import os

class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    @staticmethod
    def init_app(app):
        pass

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    MAIL_SERVER = os.getenv('MAIL_SERVER')
    MAIL_PORT  = int(os.getenv('MAIL_PORT'))
    MAIL_USE_TLS = True if 'True' == os.getenv('MAIL_USE_TLS') else False
    MAIL_USE_SSL = True if 'True' == os.getenv('MAIL_USE_SSL') else False
    MAIL_DEBUG  = True if 'True' == os.getenv('MAIL_DEBUG') else False
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    SECRET_KEY = os.urandom(16)
    
class TestingConfig(Config):
    ...

class ProductionConfig(Config):
    ...

config = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig
}