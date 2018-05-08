<template>
    <section class="space-invaders">

        <h1>Let's play some Space Invaders!</h1>
        <hr>
        <p>
            We won't be recording every movement into the blockchain. What we <b>will</b> be storing is a list of high scores.
        </p>


        <hr>

        <section class="panel">
            <section class="box" v-if="!scatter">
                <figure class="header">
                    <h1>You don't seem to have Scatter!</h1>
                </figure>
                <p>You're going to need to download and install Scatter first before you can do anything else on this application.</p>

                <router-link :to="{name:routeNames.INDEX}" class="link" :class="{}">
                    <button>Go To Download Scatter</button>
                </router-link>
            </section>

            <section class="box" v-if="scatter&&!identity">
                <figure class="header">
                    <h1>
                        Oh you want to play Space Invaders?
                    </h1>
                </figure>
                <p>
                    In order to save your high scores we're going to need your Identity.
                </p>

                <button v-on:click="requestIdentity">Provide Identity</button>
            </section>

            <section class="box" v-if="scatter&&identity">
                <figure class="header">
                    <h1>
                        Lock and load!
                    </h1>
                </figure>
            </section>


            <section class="info" v-if="scatter">
                <h1>Your Identity name is your Player name.</h1>
                <br>
                <p>
                    We're going to be using your Identity name to record high scores on the blockchain.
                </p>
                <br>
                <br>
                <h2>Setting some permissions</h2>
                <br>
                <p>
                    You probably don't want to have to approve the transaction every time you beat your high score.
                    You can click the big checkbox on the lower left side of the "Signature Request" popup to enable a whitelist for
                    this transaction, and then select the checkbox next to the <b>score</b> which will allow the score to change every time
                    without affecting the whitelist permission.
                </p>
                <br>
                <br>

                <h2>Auto Lock</h2>
                <br>
                <p>
                    If you have lowered your Auto Lock settings it might lock while you're playing and you wont be able to
                    record your score.
                </p>
            </section>
        </section>

        <hr>

        <section v-if="identity" class="panel">
            <div id="phaser-example"></div>
        </section>

        <section v-else class="panel">
            <h1><i class="fa fa-exclamation-triangle"></i> Provide an Identity to start playing</h1>
        </section>

        <hr>

        <section class="panel" v-if="scatter">

            <section class="box">
                <figure class="header">
                    <h1>
                        Last High Score<br>
                        <b>{{lastHighScore}}</b>
                    </h1>
                </figure>

            </section>


            <section class="info">
                <h1>High Scores.</h1>
                <br>
                <p>
                    <b>
                        Record your high scores on the blockchain.
                    </b>
                </p>
                <hr>
                <figure v-for="(highScore, rank) in highScores" style="margin-bottom:5px; border-bottom:1px solid rgba(0,0,0,0.05); padding-bottom:5px;">
                    <figure :class="{'first-place':rank === 0}">
                        <span>#{{rank+1}}</span> <b>{{highScore.score}}</b> - {{highScore.username}}
                    </figure>
                </figure>
            </section>
        </section>



    </section>
</template>

<script>
    import {mapActions, mapGetters, mapState} from 'vuex'
    import * as Actions from '../store/constants';
    import {RouteNames} from '../vue/Routing'
    import * as SpaceInvaders from '../games/SpaceInvaders'

    import Eos from 'eosjs';

    let fetchTimeout = null;

    export default {
        data(){ return {
            lastHighScore:0,
            localEos:null,
            highScores:[],
            routeNames: RouteNames
        }},
        computed: {
            ...mapState([
                'scatter',
                'eos',
                'identity',
            ]),
            ...mapGetters([
                'account',
                'httpEndpoint',
                'eosNetwork'
            ])
        },
        mounted(){
            if(this.identity) SpaceInvaders.load(this.gameOver);
            setTimeout(() => {
                this.getHighScores();
            }, 500);
        },
        methods: {
            requestIdentity(){
                this.scatter.getIdentity({ accounts:[this.eosNetwork] }).then(id => {
                    if(!id) return false;
                    this[Actions.SET_IDENTITY](id);
                    SpaceInvaders.load(this.gameOver)
                }).catch(e => console.log(e))
            },
            gameOver(score){
                if(score > this.lastHighScore) {
                    this.lastHighScore = score;
                    const account = this.scatter.identity.accounts.find(account => account.blockchain === 'eos');

                    const options = {
                        authorization: [
                            `${account.name}@${account.authority}`,
                            `${process.env.SPACE_INVADERS_OWNER_NAME}@active`
                        ]
                    };

                    const signProvider = (buf, sign) => {
                        return sign(buf, process.env.SPACE_INVADERS_OWNER_PKEY)
                    };

                    const username = this.scatter.identity.name;
                    this.eos.contract('invaders', {signProvider}).then(contract => {
                        contract.scored(username, score, account.name, process.env.SPACE_INVADERS_OWNER_NAME, options)
                    });
                }
            },
            getHighScores(){
                clearTimeout(fetchTimeout);

                const eos = Eos.Localnet({httpEndpoint:this.httpEndpoint});
                eos.getTableRows({
                    "json": true,
                    "scope": 'invaders',
                    "code": 'invaders',
                    "table": "scores",
                    "limit": 500
                }).then(result => {
                    this.highScores = result.rows.sort((a,b) => b.score - a.score);
                    if(this.identity){
                        const username = this.scatter.identity.name;
                        const playerBest = this.highScores.find(x => x.username === username);
                        if(playerBest) this.lastHighScore = playerBest.score;
                    }

                    fetchTimeout = setTimeout(() => {
                        this.getHighScores();
                    }, 5000);
                })
            },
            ...mapActions([
                Actions.SET_IDENTITY
            ])
        },
        watch:{
            identity(a){
                if(a){
                    SpaceInvaders.load(this.gameOver);
                }
            }
        }
    }
</script>

<style lang="scss">
    .first-place {
        color:blue;
    }
</style>