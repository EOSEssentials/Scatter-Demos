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

    void scored( string username, uint64_t score, account_name identity_account, account_name application ){
        eosio_assert(state_config::exists(), "Contract does not yet have an application key");
        eosio_assert(state_config::get().application == application, "Application key does not match");
        require_auth(identity_account);
        require_auth(application);


        TABLE_Scores _scores(_self, _self);

        hash index = usernameToHash(username);
        auto record = _scores.find( index );
        if(record == _scores.end()) _scores.emplace( identity_account, [&]( auto& a ) {
            a.index = index;
            a.username = username;
            a.score = score;
            a.identity_account = identity_account;
        });
        else _scores.modify( record, 0, [&]( auto& a ) {
            eosio_assert(record->identity_account == identity_account, "User no longer has this account");
            eosio_assert(record->score < score, "Previous score was higher");
            a.score = score;
        });
    }

    void own( account_name application ){
        require_auth(_self);
        require_auth(application);
        eosio_assert(!state_config::exists(_self), "Application owner already exists");
        state_config::set(config{application}, _self);
    }

    void del( string username ){
        require_auth(_self);

        TABLE_Scores _scores(_self, _self);

        auto itr = _scores.find( usernameToHash(username) );
        eosio_assert(itr != _scores.end(), "No such username");
        _scores.erase(itr);
    }


private:
    typedef uint64_t hash;
    /***
     * Structs
     ****************************************************/

    // @abi table scores i64
    struct scores {
        hash index;
        string username;
        uint64_t score;
        account_name identity_account;

        hash primary_key()const { return index; }
        EOSLIB_SERIALIZE( scores, (index)(username)(score)(identity_account) )
    };

    static hash usernameToHash(string username){
        return std::hash<string>{}(username);
    }

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

EOSIO_ABI( invaders, (scored)(own)(del) )
