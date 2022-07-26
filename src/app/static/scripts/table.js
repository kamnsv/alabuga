'use_strict';
var tbl = {
	props: ['headers', 'keys', 'items', 'adds'],
	data() {
		return {
			ff: '', //filter_field
			ft: '', //filter_text
		}
	},//data
	methods: {
		filter(field, txt){
			this.ff = field;
			this.ft = txt;
		},//filter
		
		sort(el, field){
			let s = -el.attributes['data-sort'].value*1;
			if (0 === s) s = 1;
			el.attributes['data-sort'].value = s;
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
	
	template:`
	<search-field :fields="headers" :values="keys" @filter="filter"></search-field>
	<div class='tbl__wrap'>
					<div class="tbl__scroll">
						<table>
							<thead>
								<tr class='tbl__htr'>
									<th v-for="(h, i) in headers" :class="'tbl__th ' + keys[i]">
										<span class='tbl__hspan tbl__hspan_sort' data-sort='0'
										@click="sort($event.target, keys[i])">{{h}}</span>
									</th>
									<th class='tbl__th tbl__th_x'>
										<span class='tbl__hspan'>Удалить</span>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr class='tbl__dtr' v-for="(item, i) in itemsf">
									<td :class="'tbl__td ' + k + (k in adds ? ' tbl__td_write':'')" v-for="(k, j) in keys" 
										@dblclick="$emit('update', k, item.id, item[k], headers[j], $event.target)">{{item[k]}}</td>
									<td class='tbl__td tbl__td_x' 
										@click="$emit('del', item.id, $event.target)">x</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>`
}//table-content
