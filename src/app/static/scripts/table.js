'use_strict';
var tbl = {
	props: ['headers', 'keys', 'items', 'adds'],
	
	data() {
		
		return {
			sort_flags: {}
		}
		
	},//data
	
	methods: {
		
		sort(field){
			console.log(field);	
		},//sort
		
	},//methods
	
	template:`<div class='tbl__wrap'>
					<div class="tbl__scroll">
						<table>
							<thead>
								<tr class='tbl__htr'>
									<th class='tbl__th tbl__th_n'>
										<span class='tbl__hspan'>№</span>
									</th>
									<th v-for="(h, i) in headers" :class="'tbl__th ' + keys[i]">
										<span class='tbl__hspan' @click="sort(keys[i])">{{h}}</span>
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
}//table-content
