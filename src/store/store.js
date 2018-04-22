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
    account:state => state.scatter.identity.account,
    httpEndpoint:state => `http://${process.env.NETWORK_HOST}:${process.env.NETWORK_PORT}`
};

export const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})