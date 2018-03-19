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
                    Account names are subject to change since you can swap out your account inside of your Identity. We don't want that to
                    happen in this case because your high score would get lost if you changed accounts!
                    <br><br>
                    Because of that Scatter provides the game with the Identity name of your choosing, and an account to sign the transaction of
                    recording your high score with. Woohoo, now you're free to change accounts and keep your high score.
                </p>
                <br>
                <br>

                <h2><b>IMPORTANT!</b></h2>
                <br>
                <p>
                    Go into your Scatter settings and turn up the settings on the Auto Lock feature or you might play for
                    longer than it's set for and not be able to upload your score.
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
                        Right now there is an issue with storing strings inside of a contract on the version of our EOS node.
                        We're using the first 12 characters of the identity name to store scores instead at the moment. If the first 12 characters
                        fails the test making it into an account name, the actual account name will be used instead.
                        This will be fixed the second we're able.
                    </b>
                </p>
                <hr>
                <figure v-for="(highScore, rank) in highScores" style="margin-bottom:5px; border-bottom:1px solid rgba(0,0,0,0.05); padding-bottom:5px;">
                    <figure :class="{'first-place':rank === 0}">
                        <span>#{{rank+1}}</span> <b>{{highScore.score}}</b> - {{highScore.identity}}
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
                this.scatter.getIdentity(['account']).then(id => {
                    if(!id) return false;
                    this.scatter.useIdentity(id);
                    SpaceInvaders.load(this.gameOver)
                }).catch(e => console.log(e))
            },
            gameOver(score){
                if(score > this.lastHighScore) {
                    this.lastHighScore = score;

                    const options = {
                        scope: ['invaders', this.scatter.identity.account.name],
                        authorization: [
                            `${this.scatter.identity.account.name}@${this.scatter.identity.account.authority}`,
                            `${process.env.SPACE_INVADERS_OWNER_NAME}@active`
                        ]
                    };

                    let idNameToAccName = this.scatter.identity.name.substr(0, 12).toLowerCase();
                    if(!/(^[a-z1-5.]{1,11}[a-z1-5]$)|(^[a-z1-5.]{12}[a-j1-5]$)/g.test(idNameToAccName)){
                        idNameToAccName = this.scatter.identity.account.name;
                    }

                    this.eos.contract('invaders', { keyProvider:process.env.SPACE_INVADERS_OWNER_PKEY }).then(contract => {
                        contract.score(idNameToAccName, score, this.scatter.identity.account.name, process.env.SPACE_INVADERS_OWNER_NAME, options)
                    });
                }
            },
            getHighScores(){

                const host = process.env.NETWORK_HOST;
                const port = process.env.NETWORK_PORT;
                const eos = Eos.Localnet({httpEndpoint:`http://${host}:${port}`});
                eos.getTableRows({
                    "json": true,
                    "scope": 'invaders',
                    "code": 'invaders',
                    "table": "scores",
                    "limit": 500
                }).then(result => {
                    this.highScores = result.rows.sort((a,b) => b.score - a.score);
                    if(this.identity){
                        const playerBest = this.highScores.find(x => x.identity === this.identity.name);
                        if(playerBest) this.lastHighScore = playerBest.score;
                    }

                    setTimeout(() => {
                        this.getHighScores();
                    }, 2000);
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