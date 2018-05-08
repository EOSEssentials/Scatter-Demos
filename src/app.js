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
        // const digest = '3aad9fc133fc1f53e8f233a235f040e7e535d733f28970eebac3168a78507016';
        const digest = '3aad9fc133fc1f53e8f233a235f040e7e535d733f28970eebac3168a78507016';

        // const sig = ecc.Signature.signHash(digest, '5KjbZQLH3EAfgXF3jejYM2WZjzJCUQH7NEkT1mVcBy2xoFdSWro');
        const sig = ecc.Signature.signHash(digest, '5KY217mNt7Eg4tqewNpcPqPkvncYN7SgBdzZz8cdcW5D7RBasGb');
        console.log('sig 1', sig);
        console.log('sig 2', sig.toString());
        const sig2 = ecc.sign(digest, '5KjbZQLH3EAfgXF3jejYM2WZjzJCUQH7NEkT1mVcBy2xoFdSWro');
        console.log('sig', sig2.toString());
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
