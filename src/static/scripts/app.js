'use_strict';
const root = {
	data() 
	{
	return {
		nav_items:{
			home: 'Главная',
			city: 'Город',
			auth: 'Вход',
		} ,
		style_home: 'background: radial-gradient(farthest-corner at 58% 27%, #aaa -8%,  transparent 40%)',
		style_page: 'background: radial-gradient(farthest-corner at 50% 10%, transparent  3%, #bbb  83%)',
		current_page: 'home',
		main: {}
		}
	},//data
	
	computed: {

	},//computed
	
	
	methods: {
		
		change_page(page_name) {
			if (location.pathname != '/'){
				location.pathname = '/';
			}
			else {
				this.current_page = page_name; 
				console.log(page_name);
			}
		}
		
	},//methods
	
	created(){
		//
		document.querySelector('body').style = this.style_home;
		//
		fetch('/api?main')
	    .then((response) => {
			return response.json();
		})
		.then((data) => {
			this.main = data;
		});
		//
	},//created
	
	mounted() {
		let page = location.pathname.slice(1);
		if ('' != page && page != this.current_page)
			this.current_page = page;
		console.log(this.current_page);
	},//mounted
	
	components: {
		'nav-menu': menu,
		'home-page': home,
		'error': error,
	},//components
	watch:{
		current_page(new_page, old_page){
			let body = document.querySelector('body');
			if ('home' == new_page){
				body.style = this.style_home;
			}
			else {
				body.style = this.style_page;
			}
		}
	}//watch
}//root


const app = Vue.createApp(root);
const vm = app.mount('#app');