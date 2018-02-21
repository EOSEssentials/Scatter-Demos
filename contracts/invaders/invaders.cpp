#include <invaders.hpp>

using namespace eosio;
using namespace invaders;

void apply_score( const score& message ){
    require_auth(message.signatory);
    score score{message.identity, message.score};
    scores::store( score );
}

extern "C" {
    void init()  {}

    void apply( uint64_t code, uint64_t action ) {
       eosio::print( "invaders Contract Apply: ", eosio::name(code), "->", eosio::name(action), "\n" );

        if( code == N(invaders) ) {
            if( action == N(score) ) apply_score(current_message< score >());
        }
    }

} // extern "C"
