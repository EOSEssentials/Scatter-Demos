#include <eosiolib/eosio.hpp>
#include <eosiolib/singleton.hpp>
using namespace eosio;
using namespace std;

class paint : contract {
    using contract::contract;

    static constexpr uint64_t code = N(paint);

    inline static uint64_t makeUUID(string s){
        return std::hash<string>{}(s);
    }

    // @abi table pixels i64
    struct Pixel {
        uint64_t        pos;
        uint64_t        x;
        uint64_t        y;
        string          color;
        string          username;

        uint64_t primary_key() const { return pos; }
        EOSLIB_SERIALIZE( Pixel, (pos)(x)(y)(color)(username) )
    };

    // @abi table timestamps i64
    struct Timestamp {
        uint64_t        timestamp;
        EOSLIB_SERIALIZE( Timestamp, (timestamp) )
    };

    typedef multi_index<N(pixels), Pixel>           Pixels;
    typedef singleton<N(timestamps), Timestamp>     Timestamps;
    typedef singleton<N(owner), account_name>       Owner;

public:
    paint( account_name self ) : contract(self){}

    void own( account_name owner ){
        require_auth(_self);
        Owner(code,_self).set(owner,_self);
    }

    void fill( uint64_t x, uint64_t y, string color, string username, string scatter_hash, account_name account ){
        require_auth(Owner(code,_self).get_or_default(_self));
        require_auth(account);
        eosio_assert(x >= 0 && x <= 99, "X is out of bounds");
        eosio_assert(y >= 0 && y <= 49, "Y is out of bounds");

        uint64_t scatter = makeUUID(scatter_hash);

        uint64_t pos = makeUUID(to_string(x) + 'x' + to_string(y));
        eosio_assert(Timestamps(code,scatter).get_or_default(Timestamp{0}).timestamp+(60*5) < now(), "You must wait 5 minutes between pixels");

        Pixels pixels(_self,_self);
        auto existing = pixels.find(pos);
        if(existing == pixels.end())
             pixels.emplace( _self,     [&](auto& record){ record = Pixel{pos, x, y, color, username}; });
        else pixels.modify(existing, 0, [&](auto& record){ record = Pixel{pos, x, y, color, username}; });

        Timestamps(code,scatter).set(Timestamp{now()},_self);
    }

};

EOSIO_ABI( paint, (own)(fill) )