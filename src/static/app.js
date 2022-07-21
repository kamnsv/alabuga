'use_strict';
const root = {
	data() 
	{
	return {
		nav_items:{
			home: 'Главная',
			auth: 'Вход',
			city: 'Город',
		} ,
		current_page: 'home',
		
		}
	},//data
	
	computed: {

	},//computed
	
	
	methods: {
		
		change_page(page_name) {
			this.current_page = page_name; 
			console.log(page_name);
		}
		
	},//methods
	
	mounted() {
		let page = location.pathname.slice(1);
		if ('' != page && page != this.current_page)
			this.current_page = page;
		console.log(this.current_page);
	},//mounted
	
	components: {
		'nav-menu': menu,
		'home': home,
		'error': error,
	},//components
	
}//root


const app = Vue.createApp(root);
const vm = app.mount('#app');