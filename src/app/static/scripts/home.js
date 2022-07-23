'use_strict';
const home = {
    props: [], 
	data() {
		return {
            hello: 'Привет, я',
            title: 'Камнев Сергей',
            prof: ['Инженер-программист', 
                    'Fullstack-разработчик', 
                    'Data Science и нейронные сети'],
            img: 'https://avatars.githubusercontent.com/u/10821231?v=4',
            works: {
                'Сайт с нуля под ключ': 'fa-solid fa-key',
                'Адаптивно-отзывчива верстка': 'fa-solid fa-mobile-screen',
                'SEO. Вывод в топ поисковых систем': 'fa-solid fa-magnifying-glass-dollar',
                'Парсинг и анализ сайтов.': 'fa-solid fa-chart-line',
                'Проектировка баз данных': 'fa-solid fa-database',
            }
        }
	},//data
	
    template:   `<div class='main'>
		<div class='main__inf'>
			<span class='main__title'>{{hello}}</span>
			<h1 class='main__title'>{{title}}</h1>
			<ul class='main__list'>
				<li v-for="item in prof" class='main__item'>{{item}}</li>
			</ul>
		</div>
		<div class='main__img'>
			<div class='main__geo'>
				<img :src="img" class='main__src'/>
			</div>
		</div>
		<div class='main__works'>
			<ul class='main__stars'>
				<li v-for="(k, v) in works" class='main__star'>
				<i :class="k"></i>
				<span class='main__work'>{{v}}</span>
				</li>
			</ul>
		</div>
	</div>`
};//home     
