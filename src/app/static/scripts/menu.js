'use_strict';
const menu = {
    props: ['items'],   
    template:   `<nav class="menu">
                        <ul class="menu__list">
                            <li v-for="(v, k) in items" 
								:class="'menu__item'" 
								:id="'menu-' + k"
								@click="$emit('go', k)">
								{{v}}
                            </li>
                        </ul>
                </nav>`
};//menu     
