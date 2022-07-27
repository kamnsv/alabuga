'use_strict';
var city = {
    props: [],
	data() {
		return {
			collections: {
				Citizens: {'title': 'Горожане'},
				Statuses: {'title': 'Соц.статусы'},
			},
			cach: {},
			current: 'Citizens',
			form_add: false,
			action: false,
			values: []
		}
	},//data
	
	computed: {
		
		access(){
			return typeof(user) != 'undefined';
		},//access
		
		content(){
			return this.cach[this.current];
		},//content
		
		curcol(){
			return this.collections[this.current];
		},//curcol
		
		books(){
			return {}
		},//books

	},//computed
	
	methods: {
		
		submit(values){
			let res = false;
			if ('Добавить' == this.action)
				res = this.add_data(values);
			else if ('Править' == this.action)
				console.log(this.values);
				
			if (res) this.action = false;
		},//submit
		
		modal_add(){
			this.action = 'Добавить';
		},//modal_add
		
		modal_put(values, id){
			this.values = JSON.parse(JSON.stringify(values));
			this.id = id;
			this.action = 'Править';
		},//modal_put
		
		add_data(values){
			console.log('add-data', values);
		},//add_data
		
		delete_data(k, e){
			
			if (!confirm(`Вы действительно хотите удалить ${this.curcol.title}?`)) return;
			
			fetch(`/api/${this.current}/${k}`, {method: 'DELETE'})
			.then((response) => {
				return response.text();
			})
			.then((data) => {
				console.log(data);
				if ('ok' == data)
					e.parentNode.remove();
				else if ('ForeignKeyViolation' == data)
					alert('Сначала нужно удалить зависимости из дуругих таблиц');
			});
			
			console.log('del', this.current, k);
		},//delete_data
		
		put_update(data, id, call){
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
			.then((res) => {
				call(res)
			});
		},//send_update
		
		update_data(col, id, cur, head, e){
			if (e.classList.contains('tbl__td_write')) {
				let nw = prompt(`Введите новое значение "${head}" для коллекции "${this.curcol.title}"`, cur);
				if (null == nw) return;
				data = {}
				data[col] = nw;
				console.log(data);
				this.put_update(data, id, res => {
					console.log(res);
					e.innerHTML = nw;
				});
			} else {
				for (i of this.content.items)
					if (i.id == id) {
						
						return this.modal_put(i, id)
					}
			}
			
		},//update_data
		
		transform(data, col){
			let content = {headers: [], keys: []}
			
			for (i in data)
				data[i]['num'] = i*1 + 1;
			
			content.items = data;
			
			switch(col) {
			
			  case 'Citizens':  
				content.headers = ['№', 'Имя', 'Деятельность', 'Доход', 'Начальник', 'Возраст']; 
				content.keys = ['num', 'name',  'Statuses.status', 'Statuses.salary', 'Citizens.name', 'age',];
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
		'modal': modal
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
					</li>
				</ul>
			</aside>
			<content class='city__content' >
						<table-content v-bind="content"							
							@del="delete_data"
							@update="update_data"
							@add="modal_add"
						></table-content>
			</content>
		</div>
	</div>
	<modal :values="values" :action="action" 
		   :labels="content.headers.slice(1)"
		   :names="content.keys.slice(1)"
		   :books="books"
		   @submit="submit" 
		   @close="action=false" 
		   ></modal>
	`
};//city     