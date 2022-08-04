![](https://img.shields.io/badge/python-3.8.10-blue)
![](https://img.shields.io/badge/flask-2.1.3-red)
![](https://img.shields.io/badge/vuejs-3.2.36-green)


> SPA созданое входе [тестового практического задания](/task.md)

## Содержание

- [Зависимости](#зависимости)
- [Окружение](#окружение)
- [База данных](#база-данных)
- [Миграции](#миграции)
- [Фронтенд](#фронтенд)
- [Запуск](#запуск)


## Зависимости

* Основные зависимости:

```
Flask==2.1.3
Flask-Mail==0.9.1
Flask-Migrate==3.1.0
Flask-Seeder==1.2.0
Flask-SQLAlchemy==2.5.1
```

* Для базы данных PostgreSQL:

```
psycopg2==2.9.3
```

### Установка через `pip`:

```
pip install -r requirements.txt
```


## Окружение

```
SECRET_KEY={rand_long_byte_string}
MAIL_SERVER={smtp}
MAIL_PORT={port}
MAIL_USE_TLS={bool}
MAIL_USE_SSL={bool}
MAIL_DEBUG={bool}
MAIL_USERNAME={email}
MAIL_PASSWORD={token}
MAIL_DEFAULT_SENDER={email}
DATABASE_URL=postgresql://{user}:{pwd}@{ip}:{post}/{dbname}
FLASK_APP=src/alabuga.py
```

## База данных

- [Концептуальная схема БД](https://drive.google.com/file/d/1HpQzQCDC-wWoWWWBbn3loMn6_kogrE8X/view?usp=sharing)
- [Логическая схема БД](https://drive.google.com/file/d/1Zi3l9MCKxhXyHXUs5DtuIWoMCpGbgrvh/view?usp=sharing)


## Миграции

```
flask db init
flask db migrate
flask db upgrade
```

## Seed

Заполнение таблицы. По умолчанию 500 горожан и 9 социальных статусов.

```
flask seed run
```

## Фронтенд

- [Макет](https://www.figma.com/file/41UzqD8Kr9yOjp3ek8aine/Untitled?node-id=0%3A1)

## Запуск

```
flask run
```		
