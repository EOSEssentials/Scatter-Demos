import * as Actions from './constants'

export const actions = {
    [Actions.SET_SCATTER]:({commit}, scatter) => commit(Actions.SET_SCATTER, scatter),
    [Actions.SET_EOSJS]:({commit}, eosjs) => commit(Actions.SET_EOSJS, eosjs),
    [Actions.SET_IDENTITY]:({commit}, identity) => commit(Actions.SET_IDENTITY, identity),

};