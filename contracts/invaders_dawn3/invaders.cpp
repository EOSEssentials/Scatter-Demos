#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
#include <eosiolib/singleton.hpp>
using namespace eosio;
using namespace std;

class invaders : public contract {
public:
    using contract::contract;


    /***
     * Constructor
     ****************************************************/

    invaders( account_name self )
        :contract(self){}

    /***
     * Actions
     ****************************************************/

    // @abi action
    void scored( name username, uint64_t score, account_name identity_account, account_name application ){
        eosio_assert(state_config::exists(), "Contract does not yet have an application key");
        eosio_assert(state_config::get().application == application, "Application key does not match");
        require_auth(identity_account);
        require_auth(application);

        TABLE_Scores _scores(_self, _self);

        auto previousScore = _scores.find( username );
        if(previousScore == _scores.end()) _scores.emplace( identity_account, [&]( auto& a ) {
            a.username = username;
            a.score = score;
            a.identity_account = identity_account;
        });
        else _scores.modify( previousScore, 0, [&]( auto& a ) {
            eosio_assert(previousScore->identity_account != identity_account, "User no longer has this account");
            eosio_assert(previousScore->score < score, "Previous score was higher");
            a.score = score;
        });
    }

    // @abi action
    void own( account_name application ){
        require_auth(_self);
        require_auth(application);
        eosio_assert(!state_config::exists(), "Application owner already exists");
        state_config::set(config{application});
    }


private:
    /***
     * Structs
     ****************************************************/

    // @abi table scores i64
    struct scores {
        name username;
        uint64_t score;
        account_name identity_account;

        name primary_key()const { return username; }
        EOSLIB_SERIALIZE( scores, (username)(score)(identity_account) )
    };

    struct config {
        account_name application;

        EOSLIB_SERIALIZE( config, (application) )
    };


    /***
     * Tables
     ****************************************************/

    typedef multi_index<N(scores), scores> TABLE_Scores;
    typedef singleton<N(invaders), N(config), N(invaders), config>  state_config;
};

EOSIO_ABI( invaders, (scored)(own))