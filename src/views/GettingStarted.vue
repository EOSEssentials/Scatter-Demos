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
                <p>You're going to need to download and install Scatter first before you can do anything else on this application.</p>

                <a href="https://github.com/EOSEssentials/Scatter/raw/master/scatter.zip" target="_self">
                    <button>Download Scatter</button>
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
                <h1>Installing Scatter</h1>
                <br>
                <p>
                    <span>
                        Scatter is still in development so you can't just download it through the <b>Chrome Web Store</b> yet.
                    </span>

                    <br><br>
                    To get the latest zip file you can simply click on the <b>Download Scatter</b> button to the left, then
                    extract the zip file to a folder on your computer; anywhere you like.

                    <br><br>
                    Once you've extracted the folder open up a new tab in Chrome and navigate to <u><b>chrome://extensions/</b></u>.<br>
                    <span>( We'd love to make this a clickable link for you, but Chrome doesn't allow it. )</span>

                    <br><br>
                    <br><br>
                    You will see a button there that says <b>Load unpacked extension...</b>
                    <br><br>
                    <img src="https://github.com/nsjames/Scatter/raw/master/chrome_ext.jpg" />
                    <br><br>
                    <br><br>
                    Now navigate to the folder you created before, and click ok.
                    <br><br>
                    <img src="https://github.com/nsjames/Scatter/raw/master/chrome_ext2.jpg" />
                    <br><br>
                </p>
                <section class="bordered">
                    <p>
                        <b>Once you have Scatter installed reload this page.</b>
                    </p>
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
                <p>
                    In the pursuit of making this as easy as possible, we won't make you generate any keys
                    or set any account names. We're simply going to randomly generate both for you and then give you the private key
                    so that you can import it into your Scatter.

                    <br><br>

                    Click the <b>Generate Account</b> button to left before continuing.
                </p>
                <hr>




                <!------------ NETWORK ------------>
                <h2>Adding our network</h2>
                <br>
                <p>
                    <span>In scatter you need to add networks to work with. There are a two ways you can add networks.</span>
                    <br><br><br>
                    <b><u>Using a button on the application to add a network</u></b>
                </p>
                <br>
                <section class="bordered">
                    <button v-on:click="addNetwork" style="width:150px; margin-top:0;">Add Network</button>
                    <br>
                    <span>Nothing will happen if it already exists.</span>
                </section>
                <br><br><br>
                <p>
                    <b><u>Manually adding a network from your Scatter's settings</u></b>
                    <br><br>

                    <u>Doing this is simple:</u>

                </p>

                <ul>
                    <li>Open up the Scatter Extension</li>
                    <li>Click the <i class="fa fa-gear"></i> button on the top right</li>
                    <li>Click the <b>Networks</b> menu option</li>
                    <li>Click the <i class="fa fa-plus-square-o"></i> button on the top right</li>
                    <li>Then click the <i class="fa fa-check-square-o"></i> button when you are done</li>
                </ul>

                <p>
                    <u>Our network configuration is:</u>
                </p>

                <ul>
                    <li><b>Host:</b> <u>testnet1.eos.io</u></li>
                    <li><b>Port:</b> <u>80</u></li>
                </ul>
                <hr>


                <!------------ IDENTITY NAME ------------>
                <h2>Choosing your Identity name</h2>
                <br>
                <p>
                    <b>Scatter Identity names are unique across all networks</b> so that you can never be impersonated even if you aren't on the network.
                    Take for example <u>EOSSupport</u> as a name. You wouldn't want anyone impersonating that on any network once it is claimed. They also
                    serve as your <i>username</i> on applications to give you some added security to the account name you are currently using within your Identity and
                    allowing you to switch the underlying account without changing your username.
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
                        setTimeout(() => {
                            eos.transfer(stakerName, accountName, 1000000, '').then(trx => {
                                this.privateKey = privateKey;
                                this.publicKey = publicKey;
                                this.accountName = accountName;
                                this.generatingAccount = false;
                            });
                        }, 500);
                    }).catch(e => {
                        // Recursing, probably existing name or invalid character.
                        this.createAccount(tries+1);
                    })
                })
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