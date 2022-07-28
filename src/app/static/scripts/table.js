'use_strict';
console.log('table');
var tbl = {
	props: ['headers', 'keys', 'items', 'adds'],
	
	data() {
		return {
			ff: '', //filter_field
			ft: '', //filter_text
			flag: {}
		}
	},//data
	
	methods: {
		
		filter(field, txt){
			this.ff = field;
			this.ft = txt;
		},//filter
		
		sort(field){
			let s = 1;
			console.log(this.flag[field]);
			if (field in this.flag){
				s = -this.flag[field];
				this.flag[field] = s;
			}
			else {
				this.flag[field] = s;
			}
			this.items.sort(function(a, b) {	
			  if (a[field] < b[field]) return -s;
			  if (a[field] > b[field]) return s;
			  return 0;
			});
		},//sort
		
	},//methods
	
	components: {
		'search-field': search,
	},//components
	
	computed: {
	  
	  itemsf() {
		return this.items.filter((item) => { 
		    if (!this.ft) return true;
			//По полю
		    if (this.ff)  
				return (item[this.ff] + '').indexOf(this.ft) > -1;
			//По всем полям
			let s = [];
			for (i in item)  
				if ('id' != i)
					s.push(item[i]);
			s = s.join(' ');
			//if (s.indexOf(this.ft) > -1)
			//	console.log(s, s.indexOf(this.ft), this.ft);
			return s.indexOf(this.ft) > -1;
		  });
		}
		
	},//computed
	
	watch:{
		items(){
			this.flag = {};
		}
	},//watch
	
	template:`<div class='tbl'>
		<div class='tbl__panel'>
			<search-field :fields="headers" :values="keys" @filter="filter"></search-field>
			<i class="fa-solid fa-circle-plus" style="cursor: pointer" @click="$emit('add')" ></i>
		</div>
		<div class='tbl__wrap'>
					<div class="tbl__scroll">
						<table>
							<thead>
								<tr class='tbl__htr'>
									<th v-for="(h, i) in headers" class='tbl__th' :data-field="keys[i]">
										<span class='tbl__hspan tbl__hspan_sort' :data-sort='flag[keys[i]]'
										@click="sort(keys[i])">{{h}}</span>
									</th>
									<th class='tbl__th tbl__th_x'>
										<span class='tbl__hspan'>Удалить</span>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr class='tbl__dtr' v-for="(item, i) in itemsf">
									<td :class="'tbl__td ' + (k in adds ? ' tbl__td_write':'')" v-for="(k, j) in keys" 
										@dblclick="$emit('update', k, item.id, item[k], headers[j], $event.target)" :data-field="k">{{item[k]}}</td>
									<td class='tbl__td tbl__td_x' 
										@click="$emit('del', item.id, $event.target)">x</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>`
}//table-content