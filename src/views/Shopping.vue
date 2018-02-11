<template>
    <section class="getting-started">

        <h1>Getting Started with EOS and Scatter</h1>
        <hr>
        <p>
            In order to play around with these demos you're going to need a couple things first, like Scatter and an EOS account on our network.
        </p>


        <hr>

        <section class="panel">

            <section class="box">
                <figure class="header">
                    <h1>
                        You don’t have an account here yet!
                    </h1>
                </figure>
                <p>
                    Account registration is the bane of our existence.
                    We all hate entering our personal information over
                    and over again to the point where we’ve even
                    resorted to trusting Facebook to keep us safe.
                    <br><br>
                    <b>Let’s give account registration the middle finger.</b>
                </p>

                <button v-on:click="requestIdentity">Provide Identity</button>
            </section>


            <section class="info">
                <h1>Signing up with an application easily</h1>
                <br>
                <p>
                    Your Identity name can not be used by anyone else on any network once it has been registered to your
                    unique Scatter. This makes it so you can never be impersonated. You are truly a special little snowflake.
                    <br><br>

                    Inside of your Identity you may store private data such as your email, name, and location. These
                    properties of your Identity are encrypted within your Scatter and can only be given to applications when
                    they request it, and only if you approve of giving it to them. Even if there is more information inside of your
                    Identity, an application will never see it unless given explicit authority to do so. What this means is you don’t
                    have to leave little fingerprints all over the internet before you actually use an application.
                    <br><br>

                    <b>
                        For instance this application requires no Identity properties at all to register, so even if you have filled out
                        your email inside of the Identity you provide the application will never know about it until they manually
                        request it and you give it permission to access it.
                    </b>
                </p>
                <p class="dev-link">I'm a developer, show me how this is done!</p>
            </section>
        </section>

        <hr>

        <section class="panel">

            <section class="box unpadded">
                <figure class="image">

                </figure>
                <section class="padder">
                    <p>
                        <span style="font-size:14px;">Some Awesome Product</span>
                        <br><br>
                        This product is awesome because it does anything
                        you want it to. Why? Because it doesn’t really exist.
                    </p>

                    <section class="button-holder">
                        <section class="requirements">
                            <span>
                                This transaction will require an EOS
                                account, email, shipping address, name and email.
                            </span>
                        </section>
                        <button v-if="!!identity" v-on:click="purchaseItem">Buy Now!</button>
                        <button v-else disabled>Buy Now!</button>
                    </section>
                </section>
            </section>


            <section class="info">
                <h1>Buying an item that needs to be shipped</h1>
                <br>
                <p>
                    Multiple forms which lead a user on are absolute crap. They use psychological techniques to make it so users
                    go through the steps with increasing difficulty. Applications are forced to decieve and manipulate you just to
                    give you something that.. you already want.
                    <br><br>

                    <b>Screw that.</b>

                    This application will provide you with one easy button to purchase and ship the item to you. You won’t need to
                    go through any meticulously planned out multipage forms, or become the subject of psychological warfare.
                    We’re simply going to bundle the transfering of funds and personal information into one easy to approve action
                    which is completely transparent to the only person that you actually care about in this exchange. <b>You.</b>
                </p>
                <p class="dev-link">I'm a developer, show me how this is done!</p>
            </section>
        </section>

        <hr>


    </section>
</template>

<script>
    import { mapActions, mapGetters, mapState } from 'vuex'
    import * as Actions from '../store/constants';
    import {RouteNames} from '../vue/Routing'

    import ecc from 'eosjs-ecc'
    import Eos from 'eosjs'

    export default {
        data(){ return {

        }},
        computed: {
            ...mapState([
                'scatter',
                'eos',
                'identity',
            ])
        },
        methods: {
            requestIdentity(){
                this.scatter.getIdentity(['account']).then(id => {
                    if(!id) return false;
                    this.scatter.useIdentity(id.hash);
                    this[Actions.SET_IDENTITY](id);
                });
            },
            purchaseItem(){
                console.log(this.identity);
                const requiredFields = ['account', 'firstname', 'lastname', 'country', 'address','phone', 'zipcode', 'city'];
                this.eos.transfer(this.identity.account.name, 'inita', 10, '', {requiredFields}).then(transaction => {

                }).catch(e => {
                    console.log('error', e)
                })
            },
            ...mapActions([
                Actions.SET_IDENTITY
            ])
        }
    }
</script>

<style lang="scss">
    .button-holder {
        overflow: hidden;
        margin-top:20px;

        .requirements {
            line-height:9px;
            width:calc(100% - 110px);
            float:left;
            padding-right:10px;
        }

        button {
            width:110px !important;
            float:left;
            margin-top:0 !important;
        }

    }
</style>