'use_strict';
const city = {
    props: [], 
	data() {
		return {
			d: 'Нет доступа'
		}
	},//data
	
	created(){
		fetch('/api?city')
	    .then((response) => {
			return response.json();
		})
		.then((data) => {
			this.d = data;
		});
		
	},//created	
	
    template:   `<div class='city'>
			{{d}}
	</div>`
};//home     
