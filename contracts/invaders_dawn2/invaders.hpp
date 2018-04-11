#include <eoslib/eos.hpp>
#include <eoslib/db.hpp>

using namespace eosio;
namespace invaders {

    struct score {
        name identity;
        uint64_t score;
        name signatory;
        name proprietor;
    };

    struct owner {
        name proprietor;
    };

    using scores = eosio::table<
            N(invaders),
            N(invaders),
            N(scores),
            score,
            name
    >;

    using owners = eosio::table<
            N(invaders),
            N(invaders),
            N(owners),
            owner,
            name
    >;

    inline owner get_owner(){
        owner found_owner;
        owners::front(found_owner);
        return found_owner;
    }

    inline bool has_owner(){
        owner found_owner;
        return owners::front(found_owner);
    }
}


