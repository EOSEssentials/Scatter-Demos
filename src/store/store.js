import Vue from 'vue'
import Vuex from 'vuex';

import {mutations} from './mutations';
import {actions} from './actions';

import DependencyError from '../errors/DependencyError'

Vue.use(Vuex);

const state = {
    scatter:null,
    eos:{getTableRows(){throw new DependencyError('Please install scatter.')}},
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