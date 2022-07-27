'use_strict';
var search = {
	props: ['fields', 'values'],
	data() {
		return {
			txt: '',
			field: '',
		}
	},//data
	
	methods: {
		
		filter(){
			this.$emit('filter', this.field, this.txt)
		},//filter
		
	},//methods
	
	watch:{
		
		txt(){ this.filter(); },
		field(){ this.filter(); },

	},//watch
	
	template:`<div class='search'>
		<label class='search__lbl'>
			<i class="fas fa-search"></i>
			<input class='search__put' type='search' v-model="txt"/>
			<select class='search__sel' v-model="field">
				<option></option>
				<option v-for="(f, i) in fields" :value="values[i]">{{f}}</option>
			</select>
		</label>
</div>`
}//search
