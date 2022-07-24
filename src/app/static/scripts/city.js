'use_strict';
const add = {
	props: ['adds'],
	template:`<div class='add'>
		<form class='add__form'>
			<label class='add__lbl' v-for="(v, k) in adds">
				<span class='add__field'>{{v}}</span>
				<input type='text' class='add__data' :name="k"/>
			</label>
			<input type='button' value='Добавить'/>
		</form>
	</div>`

}

const table = {
	props: ['headers', 'keys', 'items', 'adds'],
	template:`<div class='tbl__wrap'>
					<div class="tbl__scroll">
						<table>
							<thead>
								<tr class='tbl__htr'>
									<th class='tbl__th tbl__th_n'>
										<span class='tbl__hspan'>№</span>
									</th>
									<th v-for="(h, i) in headers" :class="'tbl__th ' + keys[i]">
										<span class='tbl__hspan'>{{h}}</span>
									</th>
									<th class='tbl__th tbl__th_x'>
										<span class='tbl__hspan'>Удалить</span>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr class='tbl__dtr' v-for="(item, i) in items">
									<td class='tbl__td tbl__td_n'>{{i+1}}</td>
									<td :class="'tbl__td ' + k + (k in adds ? ' is-write':'')" v-for="(k, j) in keys" 
										@dblclick="$emit('update', k, item.id, item[k], headers[j], $event.target)">{{item[k]}}</td>
									<td class='tbl__td tbl__td_x' 
										@click="$emit('del', item.id, $event.target)">x</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>`
	
};//


const city = {
    props: [], 
	data() {
		return {
			collections: {
				Citizens: {'title': 'Горожане'},
				Statuses: {'title': 'Соц.статусы'},
				Jobs: {'title': 'Работа'},
				Works: {'title': 'Деятельность'},
				Bosses: {'title': 'Начальство'},
				Hierarchy: {'title': 'Иерархия'},
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
			if (!e.classList.contains('is-write')) return;
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
			content.items = data;
			switch(col) {
			
			  case 'Citizens':  
				content.headers = ['Имя', 'Возраст']; 
				content.keys = ['name', 'age'];
				content.adds = {name: 'Имя', age: 'Возраст'};
				break;
				
			  case 'Statuses': 
				content.headers = ['Статус', 'Уровень', 'Коэфициент']; 
				content.keys = ['status', 'lvl', 'coef'];
				content.adds = {status: 'Статус', lvl: 'Уровень', coef: 'Коэфициент надбавки'};
				break;
				
			  case 'Works':
				content.headers = ['Работа', 'Ставка'];
				content.keys = ['work', 'rate'];
				content.adds = {work: 'Работа', rate: 'Ставка'}
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
		'table-content': table,
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
};//home     

