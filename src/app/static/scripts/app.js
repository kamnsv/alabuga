'use_strict';
var root = {
	data() 
	{
	return {
		current_page: 'home',
		main: {}
		}
	},//data
	
	computed: {
		
		title(){
			if ('home' == this.current_page) return '';
			return this.nav_items[this.current_page];
		},
		
		style_bg(){
			if ('home' == this.current_page)
				return 'background: radial-gradient(farthest-corner at 58% 27%, #aaa -8%,  transparent 40%)';
			return 'background: radial-gradient(farthest-corner at 50% 10%, transparent  3%, #bbb  83%)';
		},
		
		nav_items() {
			return {
				home: {title: 'Главная', href: '/'},
				city: {title: 'Город', href: '/city'},
				auth: typeof(user) == 'undefined' ? {title: 'Вход', href: '/login'} : {title: 'Выход', href: '/logout'} 
			}
		},
		
	},//computed
	
	methods: {
		
		change_page(page_name) {

			if (location.pathname != '/'){
				location.pathname = '/';
			}
			else {
				this.current_page = page_name;
			}
		}
		
	},//methods
		
	mounted() {
		
		let page = location.pathname.slice(1);
		if ('' != page && page != this.current_page){
			if ('login' == page) {
				page='auth';
			}
			if ('logout' == page) {
				page = 'home';
				location.pathname = '/';
			}
			this.current_page = page;
		}
		
	},//mounted
	
	components: {
		'nav-menu': menu,
		'home':     home,
		'error':    error,
		'auth':     auth,
		'city':     city
	},//components
}//root

const app = Vue.createApp(root);
const vm = app.mount('#app');