#include <eoslib/eos.hpp>
#include <eoslib/db.hpp>

using namespace eosio;
namespace invaders {

    struct score {
        name identity;
        uint64_t score;
        name signatory;
    };

    using scores = eosio::table<
            N(invaders),
            N(invaders),
            N(scores),
            score,
            name
    >;
}


