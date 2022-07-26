'use_strict';
var add = {
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
}//form-add

