'use_strict';
const city = {
    props: [],
	data() {
		return {
			collections: {
				Citizens: {'title': 'Горожане'},
				Statuses: {'title': 'Соц.статусы'},
			},
			cach: {},
			current: 'Citizens',
			form_add: false
		}
	},//data
	
	computed: {
		
		access(){
			return typeof(user) != 'undefined';
		},
		
		content(){
			return this.cach[this.current];
		},

	},//computed
	
	methods: {
		delete_data(k, e){
			fetch(`/api/${this.current}/${k}`, {method: 'DELETE'})
			.then((response) => {
				return response.text();
			})
			.then((data) => {
				console.log(data);
				e.parentNode.remove();
			});
			
			console.log('del', this.current, k);
		},//delete_data
		
		update_data(row, id, cur, head, e){
			if (!e.classList.contains('tbl__td_write')) return;
			let nw = prompt(`Введите новое значение "${head}" для коллекции "${this.collections[this.current].title}"`, cur);
			if (null == nw) return;
			data = {}
			data[row] = nw;
			console.log(data);
			fetch(`/api/${this.current}/${id}`, 
			{
				method: 'PUT',
				body: JSON.stringify(data),
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				console.log(data);
				e.innerHTML = nw;
			});
		},//update_data
		
		transform(data, col){
			let content = {headers: [], keys: []}
			
			for (i in data)
				data[i]['num'] = i*1 + 1;
			
			content.items = data;
			
			switch(col) {
			
			  case 'Citizens':  
				content.headers = ['№', 'Имя', 'Деятельность', 'Доход', 'Начальник', 'Возраст']; 
				content.keys = ['num', 'name',  'status', 'salary', 'boss', 'age',];
				content.adds = {name: 'Имя', age: 'Возраст'};
				break;
				
			  case 'Statuses': 
				content.headers = ['№', 'Статус', 'Доход']; 
				content.keys = ['num', 'status', 'salary'];
				content.adds = {status: 'Статус', salary: 'Доход'};
				break;
			}
			return content;
		},//transform
		
		
		load_collections(col) {
			if (col in this.cach)
				this.current = col;
			fetch(`/api/${col}`)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				this.cach[col] = this.transform(data, col);
				this.current = col;
			});
		}//load_collections
		
	},//methods
	
	created(){
		
		this.load_collections(this.current);
		
	},//created	
	components: {
		'table-content': tbl,
		'form-add': add
	},//components
    template:   `<div class='city'>
			<div v-if="!access" class='city__body city__body_noaccess'>Нет доступа</div>
			<div v-else class='city__body'>
			<aside class='city__aside'>
				<ul class='col__list'>
					<li v-for="(v, k) in collections" 
						class='col__item' 
						@click="load_collections(k)">
						{{v.title}}
					</li>
					<!--<li class='col__add' @click="form_add=true">Добавить</li>-->
				</ul>
			</aside>
			<form-add v-if="form_add" :adds="content.adds"></form-add>
			<content class='city__content' >
						<table-content
							:headers="content.headers"
							:keys="content.keys"
							:items="content.items"
							:adds="content.adds"
							@del="delete_data"
							@update="update_data"
						></table-content>
					</div>
				</div>
			</content>
		</div>
	</div>
	`
};//city     