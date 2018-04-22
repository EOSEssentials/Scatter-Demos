<template>
    <section class="getting-started">

        <h1>Getting Started with EOS and Scatter</h1>
        <hr>
        <p>
            In order to play around with these demos you're going to need a couple things first, like Scatter and an EOS account on our network.
        </p>


        <hr>

        <section class="panel">

            <section class="box" v-if="!scatter">
                <figure class="header">
                    <h1>You don't seem to have Scatter!</h1>
                </figure>
                <!--<p>You're going to need to download and install Scatter first before you can do anything else on this application.</p>-->

                <a href="https://chrome.google.com/webstore/detail/scatter/ammjpmhgckkpcamddpolhchgomcojkle" target="_blank">
                    <button>Go To Chrome Store</button>
                </a>
            </section>

            <section class="box" v-else>
                <figure class="header">
                    <h1>Woohoo! You have Scatter Installed</h1>
                </figure>
                <p>
                    If you have already set up your network and Identity you can just select an application from the menu on the left.
                </p>
            </section>


            <section class="info">
                <section v-if="scatter">
                    <h1>Updating Scatter</h1>
                    <br>
                    <p>
                        Since Scatter is still in development you will have to manually update it. Sorry for the inconvenience.
                        <br>
                        <br>
                        To check your current Scatter version go to <u><b>chrome://extensions/</b></u> and look at the number next
                        to the <b>Scatter</b> title.
                        If it is not <b style="font-size:13px">2.1</b> you need to update your Scatter.
                        <br>
                        <br>
                        To do so first click the trash icon next to the Scatter plugin from the Chrome extensions page.
                        Then delete you Scatter folder, and follow the installation instructions again.
                        <br>
                        <br>
                        <b>
                            Once you have version 2.1 you will no longer need to manually check your Scatter version as that version included
                            a way to require a minimum Scatter version and notify the user in the case that it doesn't match.
                        </b>

                    </p>
                </section>

                <section v-if="!scatter">
                    <h1>Installing Scatter</h1>
                    <br>
                    <p>
                        <u><span>Scatter is only available for Chrome right now.</span></u>
                        <br><br>
                    </p>
                    <section class="bordered">
                        <p>
                            <b>Once you have Scatter installed reload this page.</b>
                        </p>
                    </section>
                </section>


            </section>
        </section>


        <hr>

        <section class="panel">


            <section class="box">
                <section v-if="!privateKey">
                    <figure class="header"><h1>
                        Let's create an account!
                    </h1></figure>
                    <p>
                        You won't be able to do anything on the EOS blockchain without an account.
                    </p>
                </section>
                <section v-else>
                    <figure class="header"><h1>
                        Account generated!
                    </h1></figure>
                    <p>
                        <span>
                            This account was created on our network, staked for use, and has enough EOS tokens to do all of these demos many times over.
                        </span>
                        <br><br>

                        <b>Account Name: </b> <span>{{accountName}}</span>
                        <br><br>
                        <b>Private Key: </b> <textarea spellcheck="false" class="private-key" v-model="privateKey"></textarea>
                        <br><br>
                        <b>Public Key: </b> <span>{{publicKey}}</span>
                    </p>
                </section>

                <button v-if="!generatingAccount" v-on:click="generateAccount">Generate Account</button>
                <button v-else disabled>
                    <i class="fa fa-spinner fa-spin"></i>
                </button>
            </section>


            <section class="info">
                <h1>Getting Scatter all set up</h1>
                <br>
                <p>
                    <span>
                        After you configure your password Scatter will lead you through creating your first Identity.
                        You can name it anything you want, but before you do you'll have to create an account and add a network to use it on.
                        Follow the steps below to do just that.
                    </span>
                </p>
                <hr>

                <!------------ ACCOUNT ------------>
                <h2>Generate an EOS Account</h2>
                <br>
                <h3>Really, all you have to do is generate an account, and put that account into a Scatter Identity.</h3>
                <br>
                <p>
                    In the pursuit of making this as easy as possible, we won't make you generate any keys
                    or set any account names. We're simply going to randomly generate both for you and then give you the private key
                    so that you can import it into your Scatter.

                    <br><br>

                    Click the <b>Generate Account</b> button to left before continuing.
                </p>

                <hr>

                <!------------ IDENTITY NAME ------------>
                <h2>What about your Identity name?</h2>
                <br>
                <p>
                    <b>When you first create an Identity it will be assigned a random name.</b> If you want a vanity name of your choosing you will have to register your
                    Identity with RIDL, which also comes with some added decentralized security for Scatter and the ability to join the reputation system.
                    <br><br>
                    <b>Scatter Identity names are unique across all networks</b> so that you can never be impersonated even if you aren't on a specific network.
                    Take for example <u>EOSSupport</u> as a name. You wouldn't want anyone impersonating that on any network once it is claimed. They can also
                    serve as your <i>username</i> on applications.

                </p>
            </section>
        </section>


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
            generatingAccount:false,

            privateKey:'',
            publicKey:'',
            accountName:''
        }},
        computed: {
            ...mapState([
                'scatter',
                'eos'
            ])
        },
        methods: {
            generateAccount(){
                this.generatingAccount = true;
                setTimeout(() => this.createAccount(), 200)
            },
            randomAccountName(){
                const size = Math.random() * 8 + 2;
                let text = "";
                const possible = "abcdefghij12345.";
                for(let i=0; i<size; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
                return text;
            },
            createAccount(tries = 0){
                this.scatter.suggestNetwork().then(() => {
                    if(tries > 5) {
                        this.generatingAccount = false;
                        alert("Error contacting EOS node");
                        return false;
                    }
                    ecc.randomKey().then(privateKey => {
                        const publicKey = ecc.privateToPublic(privateKey);
                        const accountName = this.randomAccountName();

                        const stakerName = process.env.ACCOUNT_NAME;
                        const keyProvider = process.env.PRIVATE_KEY;
                        const httpEndpoint = `http://${process.env.NETWORK_HOST}:${process.env.NETWORK_PORT}`;

                        let eos = Eos.Localnet({httpEndpoint, keyProvider});

                        eos.newaccount({
                            creator: stakerName,
                            name: accountName,
                            owner: publicKey,
                            active: publicKey,
                            recovery: stakerName,
                            deposit: `1 EOS`
                        }).then(account => {
                            console.log(account);
                            setTimeout(() => {
                                eos.contract('eosio.token').then(contract => {
                                    contract.transfer(stakerName, accountName, '10000.0000 EOS', '').then(() => {
                                        this.privateKey = privateKey;
                                        this.publicKey = publicKey;
                                        this.accountName = accountName;
                                        this.generatingAccount = false;
                                    })
                                });
//                                this.privateKey = privateKey;
//                                this.publicKey = publicKey;
//                                this.accountName = accountName;
//                                this.generatingAccount = false;
                            }, 500);
                        }).catch(e => {
                            console.log('error', e);
                            this.generatingAccount = false;
                            // Recursing, probably existing name or invalid character.
//                            this.createAccount(tries+1);
                        })
                    })
                });

            },
            addNetwork(){
                this.scatter.suggestNetwork();
            },
            ...mapActions([

            ])
        }
    }
</script>

<style lang="scss">
    .private-key {
        width:100%;
        height:40px;
        outline:0;
        border:0;
        resize:none;
    }
</style>