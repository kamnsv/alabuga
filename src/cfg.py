import os

DEBUG=True
SECRET_KEY = os.urandom(16)
TMP_MAIL_CODE = 'Введите код для входа: <b>%s</b>'
MAIN_DATA = {
            'hello': 'Привет, я',
            'title': 'Камнев Сергей',
            'prof': ['Инженер-программист', 
                     'Fullstack-разработчик', 
                     'Data Science и нейронные сети'],
            'img': 'https://avatars.githubusercontent.com/u/10821231?v=4',
            'works': {
                'Сайт с нуля под ключ': 'fa-solid fa-key',
                'Адаптивно-отзывчива верстка': 'fa-solid fa-mobile-screen',
                'SEO. Вывод в топ поисковых систем': 'fa-solid fa-magnifying-glass-dollar',
                'Парсинг и анализ сайтов.': 'fa-solid fa-chart-line',
                'Проектировка баз данных': 'fa-solid fa-database',
            }
        }