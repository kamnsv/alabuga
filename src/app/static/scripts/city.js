'use_strict';
var val = null;
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
			values: [],
			books: []
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

	},//computed
	
	methods: {
		
		submit(){
			let res = false;
			if ('Добавить' == this.action)
				res = this.add_data();
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
		
		add_data(call= r=>{console.log(r);}){
			val = this.values;
			console.log(this.values);
			fetch(`/api/${this.current}`, 
			{
				method: 'POST',
				body: JSON.stringify({...this.values}),
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then((response) => {
				return response.json();
			})
			.then((res) => {
				call(res);
				this.content.items.push(res);
			});
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
				let e = this.content.items.find(item => {
					return item.id == id;
				});
				console.log(e);
				for (i of this.content.items)
					if (i.id == id) {
						console.log(i);
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
				content.adds = {name: 'Имя', age: 'Возраст', 'Statuses.id_status': 'Статус', 'Citizens.boss': 'Начальник'};
				break;
				
			  case 'Statuses': 
				content.headers = ['№', 'Статус', 'Доход']; 
				content.keys = ['num', 'status', 'salary'];
				content.adds = {status: 'Статус', salary: 'Доход'};
				break;
			}
			return content;
		},//transform
		
		
		load_collections(col, call=()=>{
										this.current = col;
										this.set_books(col);
									}) {
			
			if (col in this.cach){
				this.current = col;
				call();
			}
			fetch(`/api/${col}`)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				this.cach[col] = this.transform(data, col);
				call();
			});
		},//load_collections
		
		set_books(col) {
			switch(col) {
			  case 'Citizens':  
				this.books['Citizens.boss'] = {};
				
				for (i of this.cach[col].items)	
					this.books['Citizens.boss'][i.id] = i.name;
				
				
				let load_book_statuses = () => {
					this.books['Statuses.id_status'] = {};
					for (i of this.cach['Statuses'].items)	
						this.books['Statuses.id_status'][i.id] = i.status;
					console.log(this.books);
				};
				
				if ('Statuses' in this.cach) 
					load_book_statuses();
				else this.load_collections('Statuses', load_book_statuses);
					
				break;
			}				
		},//set_books
		
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
	<modal :values="values" 
		   :action="action" 
		   :items="content.adds"
		   :books="books"
		   @submit="submit" 
		   @close="action=false" 
		   ></modal>
	`
};//city     