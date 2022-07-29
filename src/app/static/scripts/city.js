'use_strict';
var city = {
    props: [],
	data() {
		return {
			collections: {
				Citizens: {'title': 'Горожане'},
				Statuses: {'title': 'Соц.статусы'},
			},
			cach: {
					'Citizens': 
					{
						adds:{}, 
						headers:[],
						keys:[],
						valid:[]
					}
			},
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
			let vals = {};
			for (i in this.values)
				if (this.content.valid.includes(i))
					vals[i] = this.values[i];
				
			let res = ()=>{this.action = false;}
			if ('Добавить' == this.action)
				this.add_data(vals, res);
			else if ('Править' == this.action)
				this.put_update(vals, this.id, res);
		},//submit
		
		modal_add(){
			this.action = 'Добавить';
		},//modal_add
		
		modal_put(values, id){
			this.values = JSON.parse(JSON.stringify(values));
			this.id = id;
			this.action = 'Править';
		},//modal_put
		
		
		delete_data(k, e){
			
			if (!confirm(`Вы действительно хотите удалить ${this.curcol.title}?`)) return;
			
			fetch(`/api/${this.current}/${k}`, {method: 'DELETE'})
			.then((response) => {
				return response.text();
			})
			.then((data) => {
				if ('ok' == data)
					e.parentNode.remove();
				else return this.show_error(data)
			});
			
		},//delete_data
		
		show_error(txt){
			switch(txt) {
				case 'ForeignKeyViolation':  
					return alert('Сначала нужно удалить зависимости из дуругих таблиц');
				
			}
			alert(txt);
		},
		
		add_data(vals, call){

			fetch(`/api/${this.current}`, 
			{
				method: 'POST',
				body: JSON.stringify(vals),
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then((response) => {
				if (response.ok) {
					return response.json();
				} else return response.text();
			})
			.then((res) => {
				if ('string' == typeof res) return this.show_error(res)
				res['num'] = this.content.items.length + 1;
				this.content.items.push(res);
				call();
			});
		},//add_data
		
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
				if (response.ok) {
					return response.json();
				} else return response.text();
			})
			.then((res) => {
				if ('string' == typeof res) return this.show_error(res)
				for (i in this.content.items)
					if (id == this.content.items[i].id){
						res['num'] = this.content.items[i].num;
						this.content.items[i] = res;
					}
				call();
			});
		},//send_update
		
		update_data(col, id, cur, head, e){
			
			let el = this.content.items.find(item => {
					return item.id == id;
				});
				
			return this.modal_put(el, id)	
			
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
				content.valid = ['name','age','boss','id_status'];
				break;
				
			  case 'Statuses': 
				content.headers = ['№', 'Статус', 'Доход']; 
				content.keys = ['num', 'status', 'salary'];
				content.adds = {status: 'Статус', salary: 'Доход'};
				content.valid = ['status', 'salary'];
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
			let asc = (a, b) => (a.order_by > b.order_by) ? 1 : -1
			let desc = (a, b) => (a.order_by > b.order_by) ? -1 : -1
			try {
			switch(col) {
				case 'Citizens':  
					let data = [];
				
					for (i of this.cach[col].items)	
						data.push({
							id: i.id,
							val: i.name,
							order_by:i.name+i.id
						});
				
					this.books['Citizens.boss'] = data.sort(asc);
				
					let load_book_statuses = () => {
						let data = [];
						for (i of this.cach['Statuses'].items)	
							data.push({
								id: i.id,
								val: i.status,
								order_by: i.salary
							});
						this.books['Statuses.id_status'] = data.sort(desc);
					};
				
					if ('Statuses' in this.cach) 
						load_book_statuses();
					else this.load_collections('Statuses', load_book_statuses);
					
					break;
			}//switch(col)
		  } catch {}			
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