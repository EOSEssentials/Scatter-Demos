#include <invaders.hpp>

using namespace eosio;
using namespace invaders;

void apply_score( const score& message ){
    require_auth(message.signatory);
    require_auth(message.proprietor);
    auto existing_owner = get_owner();
    assert(existing_owner.proprietor == message.proprietor, "incorrect contract owner");
    score score{message.identity, message.score};
    scores::store( score );
}

void apply_owner( const owner& message ){
    require_auth(message.proprietor);
    auto owner_exists = has_owner();
    assert(!owner_exists, "owner is already set");

    owner owner{message.proprietor};
    owners::store( owner );
    print("Added owner: ", owner.proprietor, " \n");
}

extern "C" {
    void init()  {}

    void apply( uint64_t code, uint64_t action ) {
       eosio::print( "invaders Contract Apply: ", eosio::name(code), "->", eosio::name(action), "\n" );

        if( code == N(invaders) ) {
            if( action == N(score) ) apply_score(current_message< score >());
            if( action == N(owner) ) apply_owner(current_message< owner >());
        }
    }

} // extern "C"
