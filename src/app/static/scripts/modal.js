'use_strict';
var modal = {
	props: ['items', 'action', 'values', 'books'],
	
	methods: {
		close(target_class){
			if ('form-over' == target_class)
				this.$emit('close');
		},//add
		issel(field){
			return 1 != field.split('.').length
		},
		field(forkey){
			return forkey.split('.')[1];
		}
	},//methods
	
	template:`
		<div class='modal__over' id='form-over' v-if="action" 
			@click="close($event.target.id)">
			<div class='modal__form'>
				<label class='modal__lbl' v-for="(v, k) in items">
					<span class='modal__field'>{{v}}</span>
					
					<input type='text' class='modal__data' v-if="!issel(k)"
						:name="k" v-model="values[k]"/>
						
					<select v-else class='modal__sel' v-model="values[field(k)]" :data-k="k">
						<option v-for="(val, id) in books[k]" :value="id">{{val}}</option>
					</select>
					
				</label>
				<button class='modal__send' @click="$emit('submit')">{{action}}</button>
			</div>
		</div>
`
}//modal
