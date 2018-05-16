import VueInitializer from './vue/VueInitializer';
import {Routing} from './vue/Routing';
import * as Actions from './store/constants'
import {RouteNames} from './vue/Routing'

import * as Eos from 'eosjs'
// import ecc from 'eosjs-ecc';
const {ecc} = Eos.modules

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

                window.scatter.requireVersion(3.0);
                store.dispatch(Actions.SET_SCATTER, window.scatter);
                store.dispatch(Actions.SET_IDENTITY, window.scatter.identity);
                // window.scatter.authenticate()
                //     .then(res => console.log('auth res', res))
                //     .catch(err => console.log('auth err', err))

                const host = process.env.NETWORK_HOST;
                const port = process.env.NETWORK_PORT;
                const network = { blockchain:'eos', host, port };

                const eosOptions = {};
                const eos = store.state.scatter.eos( network, Eos.Localnet, eosOptions );
                store.dispatch(Actions.SET_EOSJS, eos);
                window.scatter = null;
            })
        });
    }

}

const popup = new App();
