'use_strict';
const auth = {
    props: [],
	data() {
		return {
			email: '',
			put_code: false,
			code: ''
		}
	},//data
	
	methods: {
		
		send_code () {
			let url = `/mail/${this.email}`;
			fetch(url)
				.then((response) => {
					return response.text();
				})
				.then((data) => {
					if ('ok' == data)
						this.put_code = true;
				});
		},
		
		auth_code () {
			let url = `/auth/${this.code}`;
			fetch(url)
				.then((response) => {
					return response.text();
				})
				.then((data) => {
					if ('ok' == data)
						location.pathname = '/';
					
				});
			
		}
		
	},//methods
	
	computed: {
		user() {
			if (typeof(user) != 'undefined') return true;
			return false;
		} ,
	},//computed
	
	created() {
		
		if (this.user)
			location.pathname = '/logout/';

		
	},//mounted
	
    template:   `<div class='auth' v-if="!user">
		<div class='auth__put' v-if="!put_code">
			<label class='auth__label'>
				<span class='auth__span'>Введите e-mail:</span>
				<input class='auth__input' id='auth-mail' v-model="email"/>
			</label>
			<button :onclick="send_code" class='auth__cmd'>Отправить код</button>
		</div>
		
		<div class='auth__put' v-if="put_code">
			<label class='auth__label'>
				<span class='auth__span'>Введите код из сообщения:</span>
				<input class='auth__input auth__input_code' id='auth-mail' v-model="code"/>
			</label>
			<button :onclick="auth_code" class='auth__cmd'>Авторизоваться</button>
		</div>
	</div>
		`
};//home     
