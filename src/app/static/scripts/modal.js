'use_strict';
var modal = {
	props: ['names', 'labels', 'action', 'values', 'books'],
	
	methods: {
		close(target_class){
			if ('form-over' == target_class)
				this.$emit('close');
		},//add
		issel(field){
			return 1 == field.split('.').length
		}
	},//methods
	
	template:`
		<div class='modal__over' id='form-over' v-if="action" 
			@click="close($event.target.id)">
			<div class='modal__form'>
				<label class='modal__lbl' v-for="(k, i) in names">
					<span class='modal__field'>{{labels[i]}}</span>
					
					<input type='text' class='modal__data' v-if="!issel(k)"
						:name="k" v-model="values[k]"/>
						
					<select v-else class='modal__sel' v-model="values[k]">
						<option v-for="(id, val)" :value="id">{{val}}</option>
					<select>	
				</label>
				<button class='modal__send' @click="$emit('submit')">{{action}}</button>
			</div>
		</div>
`
}//modal
