'use_strict';
const menu = {
    props: ['items'],   
    template:   `<nav class='menu'>
                        <ul class='menu__list'>
                            <li v-for="(v, k) in items" 
								:class="'menu__item'" 
								:id="'menu-' + k">
								<span v-if="!v.href" @click="$emit('go', k)" class='menu__title'>
								{{v.title}}
								</span>
								<a v-else :href="v.href" class='menu__title'>
								{{v.title}}
								</a>
                            </li>
                        </ul>
                </nav>`
};//menu     
