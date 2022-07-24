![](https://img.shields.io/badge/python-3.8.10-blue)
![](https://img.shields.io/badge/flask-2.1.3-red)
![](https://img.shields.io/badge/vuejs-3-green)


> SPA созданое входе [тестового практического задания](/task.md)

## Содержание

- [Выбранный стек](#выбранный-стек)
- [База данных](#база-данных)
- [Миграции](#миграции)
- [Фронтенд](#фронтенд)
- [Запуск](#запуск)

> Ожидаемое окружение

```
SECRET_KEY={long_rand_srring}
MAIL_SERVER={smtp}
MAIL_PORT={port}
MAIL_USE_TLS={bool}
MAIL_USE_SSL={bool}
MAIL_DEBUG={bool}
MAIL_USERNAME={email}
MAIL_PASSWORD={token}
MAIL_DEFAULT_SENDER={email}
DATABASE_URL=postgresql://{user}:{pwd}@{ip}:{post}/{dbname}
FLASK_DB_SEEDS_PATH=src/seeds.py 
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

Наполняются таблицы горожан (500 имен), 20 видов работ и 10 социальных статусов.

```
flask seed run
```


## Фронтенд

- [Макет](https://www.figma.com/file/41UzqD8Kr9yOjp3ek8aine/Untitled?node-id=0%3A1)



## Запуск

```
flask run
```		
