import Vue from 'vue'
import Vuex from 'vuex';

import {mutations} from './mutations';
import {actions} from './actions';

Vue.use(Vuex);

const state = {
    scatter:null,
    eos:null,
    identity:null,
};

const getters = {
    // identities:state => state.scatter.keychain.identities,
};

export const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})