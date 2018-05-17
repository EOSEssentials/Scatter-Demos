<template>
    <section class="paint">

        <section class="panel" v-if="!scatter || !identity">
            <section class="box" v-if="!scatter">
                <figure class="header">
                    <h1>You don't seem to have Scatter!</h1>
                </figure>
                <p>You're going to need to setup Scatter first.</p>

                <router-link :to="{name:routeNames.INDEX}" class="link" :class="{}">
                    <button>Go To Getting Started</button>
                </router-link>
            </section>

            <section class="box" v-if="scatter&&!identity">
                <figure class="header">
                    <h1>
                        You need to provide an Identity to use <b>Paint</b>
                    </h1>
                </figure>
                <!--<p>-->
                    <!--In order to save your high scores we're going to need your Identity.-->
                <!--</p>-->

                <button v-on:click="requestIdentity">Provide Identity</button>
            </section>
        </section>

        <section class="colors" v-if="scatter&&identity">
            <section class="picker" style="width:100%">
                <chrome-picker style="width:100%" :value="color" @input="updateColor"></chrome-picker>
            </section>
            <section class="error" v-if="error">{{error}}</section>
            <section class="pop">
                <section v-if="popped">
                    Color: {{popped.color}} | Painted By: {{popped.name}}
                </section>
            </section>
        </section>

        <section class="board" @mouseout="unpop">
            <figure class="cover" v-if="filling"></figure>
            <figure class="pixel" @mouseover="hovered(pixel)" @click="fill(pixel)" v-for="pixel in pixels" :style="{'background-color':pixel.color}"></figure>
        </section>

    </section>
</template>

<script>
    import { mapActions, mapGetters, mapState } from 'vuex'
    import * as Actions from '../store/constants';
    import {RouteNames} from '../vue/Routing'

    import ecc from 'eosjs-ecc'
    import Eos from 'eosjs'
    import murmur from 'murmurhash';

    const getPixels = async (paint, pixels) => {
        const rows = await paint.getTableRows({
            "json": true,
            "scope": 'paint',
            "code": 'paint',
            "table": "pixels",
            "limit": 5000
        }).then(res => res.rows);

        rows.map(pixel => {
            const display = pixels.find(p => p.x === pixel.x && p.y === pixel.y);
            display.color = pixel.color;
            display.name = pixel.username;
        })
    };

    const box = 100;
    let popTimeout = null;
    export default {
        data(){ return {
            color:'#194d33',
            pixels:[],
            paint:null,
            error:null,
            popped:null,
            filling:false,
        }},
        mounted(){
            this.paint = Eos.Localnet({httpEndpoint:this.httpEndpoint});
            this.pixels = Array.from({length: box*(box/2)}, (v, k) => k+1).map(item => {
                item = item-1;
                const x = (item/box).toFixed(2).toString().split('.')[1]*2/2 || 0;
                const y = Math.floor(item/box);
                return {x, y, color:'#FFFFFF', name:'Unclaimed'};
            });

            getPixels(this.paint, this.pixels);

        },
        computed: {
            ...mapState([
                'scatter',
                'eos',
                'identity',
            ]),
            ...mapGetters([
                'httpEndpoint',
                'eosNetwork'
            ])
        },
        methods: {
            requestIdentity(){
                this.scatter.getIdentity({ accounts:[this.eosNetwork] }).then(id => {
                    if(!id) return false;
                    this[Actions.SET_IDENTITY](id);
                }).catch(e => console.log(e))
            },
            updateColor(color){
                this.color = color.hex;
            },
            hovered(pixel){
                this.popped = pixel;
            },
            unpop(){
                this.popped = null;
            },
            async fill(pixel){
                if(!this.scatter || !this.identity) return false;
                this.filling = true;
                this.error = null;
                const account = this.identity.accounts.find(account => account.blockchain === 'eos');

                const signProvider = (buf, sign) => {
                    return sign(buf, process.env.SPACE_INVADERS_OWNER_PKEY)
                };

                const paint = await this.eos.contract('paint', {signProvider});
                const filled = await paint.fill(pixel.x, pixel.y, this.color, this.identity.name, this.identity.hash, account.name,
                    {authorization:[
                        `${account.name}@${account.authority}`,
                        `${process.env.SPACE_INVADERS_OWNER_NAME}@active`
                    ]}).catch(error => {
                    this.error = JSON.parse(error).error.details[0].message.replace('condition: assertion failed: ', '');
                    this.filling = false;
                    return null;
                });
                this.filling = false;
                if(filled) getPixels(this.paint, this.pixels);
            },
//            async getPixel(x,y){
//                console.log('x', x, y);
//                const uuid = murmur.v2(`${x}x${y}`);
//                const rows = await this.paint.getTableRows({
//                    "json": true,
//                    "scope": 'paint',
//                    "code": 'paint',
//                    "table": "pixels",
//                    upper_bound:uuid+1,
//                    lower_bound:uuid,
//                    "limit": 1
//                }).then(res => res.rows);
//
//                if(rows.length){
//                    const pixel = rows[0];
//                    const display = this.pixels.find(p => p.x === pixel.x && p.y === pixel.y);
//                    display.color = pixel.color;
//                    //TODO GET RIDL NAME
//                    console.log('pix', pixel, display);
//                }
//
//                console.log('rows', rows);
//            },
            ...mapActions([
                Actions.SET_IDENTITY
            ])
        }
    }
</script>

<style lang="scss">
    .paint {

        .box {
            width:100% !important;
            margin-bottom:20px;
        }

        .pop {
            height:20px;
            margin-top:10px;
        }

        .error {
            padding:20px;
            color:red;
            font-size:16px;
            font-weight:bold;
        }

        .colors {
            overflow: hidden;
            margin-bottom:20px;
            padding-bottom:20px;

            .picker {
                width:100%;

                .vc-chrome-alpha-wrap {
                    display:none;
                }

                .vc-chrome-hue-wrap {
                    height:30px;
                    margin-bottom:0;
                }

                .vc-hue-picker {
                    height:30px;
                }

                .vc-chrome-field {
                    &:nth-child(4){
                        display: none;
                    }
                }

                .vc-chrome-saturation-wrap {
                    padding-bottom:10%;
                }
            }
        }

        .board {
            width:100%;
            overflow: hidden;
            border:1px solid #666;
            position: relative;
            padding:2px;

            .cover {
                position: absolute;
                top:0; bottom:0; left:0; right:0;
                z-index:2;
                background:rgba(0,0,0,0.4);
            }

            .pixel {
                cursor: pointer;
                float:left;
                width:calc(100% / 100);
                padding-bottom:0.98%;
                background:#fff;
                position: relative;

                &:after {
                    content:'';
                    position: absolute;
                    top:0; bottom:0; left:0; right:0;
                    border:1px solid transparent;
                    box-shadow:0 0 0 rgba(0,0,0,0);
                    transition: all 0.2s ease;
                    transition-property: border, box-shadow;
                }

                &:hover {

                    &:after {
                        border:1px solid red;
                        box-shadow:0 10px 20px rgba(0,0,0,0.2);
                    }
                }
            }
        }
    }
</style>