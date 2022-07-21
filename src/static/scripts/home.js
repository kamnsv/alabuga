'use_strict';
const home = {
    props: ['hello', 'title', 'prof', 'img', 'works'],   
    template:   `<div class='main'>
		<div class='main__inf'>
			<span class='main__title'>{{hello}}</span>
			<h1 class='main__title'>{{title}}</h1>
			<ul class='main__list'>
				<li v-for="item in prof" class='main__item'>{{item}}</li>
			</ul>
		</div>
		<div class='main__img'>
			<div class='main__geo'>
				<img :src="img" class='main__src'/>
			</div>
		</div>
		<div class='main__works'>
			<ul class='main__stars'>
				<li v-for="(k, v) in works" class='main__star'>
				<i :class="k"></i>
				<span class='main__work'>{{v}}</span>
				</li>
			</ul>
		</div>
	</div>`
};//home     
