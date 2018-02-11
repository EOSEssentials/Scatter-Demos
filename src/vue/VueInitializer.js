import Vue from 'vue'

import VueRouter from 'vue-router'
import {Routing} from './Routing';
import {store} from '../store/store'
import * as Actions from '../store/constants'

/***
 * Sets up an instance of Vue.
 * This is shared between the popup.js and prompt.js scripts.
 */
export default class VueInitializer {

    constructor(routes,
                components,
                middleware = () => {},
                routerCallback = () => {}){
        this.setupVuePlugins();
        this.registerComponents(components);
        const router = this.setupRouting(routes, middleware);

        this.setupVue(router);
        routerCallback(router, store);
    }

    setupVuePlugins(){
        Vue.use(VueRouter);
    }

    registerComponents(components){
        components.map(component => {
            Vue.component(component.tag, component.vue);
        });
    }

    setupRouting(routes, middleware){
        const router = new VueRouter({routes});
        router.beforeEach((to, from, next) => middleware(to, next, store));
        return router;
    }

    setupVue(router){
        const app = new Vue({router, store});
        app.$mount('#scatter-demos');
        document.getElementById('scatter-demos').removeAttribute('id')
    }

}