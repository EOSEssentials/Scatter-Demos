const assert = require('assert')
const Eos = require('eosjs');

describe('eosjs', () => {

    const initaPrivate = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3';
    const initaPublic = 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV';
    const keyProvider = initaPrivate;
    const eos = Eos.Localnet({httpEndpoint: 'http://192.168.56.101:8888', keyProvider});

    function randomAccountName(){
        const size = Math.random() * 8 + 2;
        let text = "";
        const possible = "abcdefghij12345.";
        for(let i=0; i<size; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    it('should be able to create new accounts', done => {
        const newAccountName = randomAccountName();
        console.log('newAccountName', newAccountName)
        eos.newaccount({
            creator: 'inita',
            name: newAccountName,
            owner: initaPublic,
            active: initaPublic,
            recovery: 'inita',
            deposit: '1 EOS'
        }).then(account => {
            console.log(account);
            done();
        })
    });

});