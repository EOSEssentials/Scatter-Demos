import VueInitializer from './vue/VueInitializer';
import {Routing} from './vue/Routing';
import * as Actions from './store/constants'
import {RouteNames} from './vue/Routing'

import * as Eos from 'eosjs'

import SidebarComp from './components/SidebarComp.vue'
import ViewBase from './views/Base.vue'

class App {

    constructor(){
        const routes = Routing.routes();
        const components = [
            {tag:'view-base', vue:ViewBase},
            {tag:'sidebar', vue:SidebarComp},
        ];

        const middleware = (to, next, store) => {
            next();
        };

        new VueInitializer(routes, components, middleware, (router, store) => {
            document.addEventListener('scatterLoaded', () => {
                store.dispatch(Actions.SET_SCATTER, window.scatter);
                window.scatter = null;

                const host = process.env.NETWORK_HOST;
                const port = process.env.NETWORK_PORT;
                const network = { host, port };
                const eosOptions = {};
                const eos = store.state.scatter.eos( Eos.Localnet, network, eosOptions );
                store.dispatch(Actions.SET_EOSJS, eos);
            })
        });
    }

}

const popup = new App();
