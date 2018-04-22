<template>
    <section class="view-base">

        <figure class="back-left"></figure>
        <figure class="back-right"></figure>

        <main v-if="!mobileMode">
            <sidebar></sidebar>
            <section class="body">
                <router-view></router-view>
            </section>
        </main>

        <main v-else class="mobile">
            <h1>Sorry!</h1>
            There is no point to display this page in mobile mode
            since Chrome on mobile does not support extensions. Please view from your desktop/laptop.
        </main>
        <!--<alert></alert>-->

    </section>
</template>

<script>
    import { mapActions, mapGetters, mapState } from 'vuex'
    import * as Actions from '../store/constants';
    import {RouteNames} from '../vue/Routing'

    export default {
        data(){ return {
            mobileMode:window.innerWidth <= 760
        }},
        computed: {
            ...mapState([

            ])
        },
        methods: {
            ...mapActions([

            ])
        }
    }
</script>

<style lang="scss">
    @import '../styles.scss';
    .view-base {
        position: relative;

        .mobile {
            background:$darkred;
            padding:20px;
            color:#fff;
        }

        .back-left, .back-right {
            position:fixed;
            top:0;
            bottom:0;
            width:50%;
            z-index:-1;
        }

        .back-left { left:0; background:$darkred; }
        .back-right { right:0; background:#f7f7f7; }

        main {
            max-width:1366px;
            margin:0 auto;
            background:#fff;
            min-height:100vh;
            overflow: hidden;
            position: relative;

            .body {
                width:calc(100% - 300px);
                margin-left:300px;
                float:left;
                padding:50px;
                margin-bottom:100px;

                h1 {
                    font-size:24px;
                    font-weight: 300;
                    color:#6b6b6b;
                }

                h2 {
                    font-size:20px;
                    font-weight: 300;
                    color:#6b6b6b;
                }

                p {
                    font-size:14px;
                    font-weight: 400;
                    color:#6b6b6b;
                }

                .dev-link {
                    cursor: pointer;
                    margin-top:20px;
                    color:$midred;
                    text-decoration: underline;
                    font-weight:bold;
                    display:inline-block;
                }

                span {
                    font-size:11px;
                    font-weight: 400;
                    color:#6b6b6b;
                }

                hr {
                    border:0;
                    width:100%;
                    height:1px;
                    background:#ebebeb;
                    margin:30px 0;
                }

                .panel {
                    overflow: hidden;

                    .box {
                        border-radius:4px;
                        border:1px solid #dfdfdf;
                        width:300px;
                        padding:20px;
                        float:left;

                        .header {
                            padding:50px 20px;
                            text-align:center;
                        }

                        .image {
                            height:150px;
                            background:#eaeaea;
                        }

                        &.unpadded {
                            padding:0;

                            .padder {
                                padding:20px;
                            }
                        }
                    }

                    .info {
                        float:left;
                        width:calc(100% - 300px);
                        padding-left:30px;
                        padding-top:20px;

                        .bordered {
                            display:inline-block;
                            padding:20px;
                            border-radius:4px;
                            border:1px solid #dfdfdf;
                        }
                    }

                    button {
                        cursor: pointer;
                        outline:0;
                        border:0;
                        border-radius:4px;
                        width:100%;
                        height:40px;
                        line-height:40px;
                        background:$midred;
                        color:#fff;
                        font-size:16px;
                        transition:background 0.2s ease;
                        font-family: 'Raleway', sans-serif;
                        margin-top:20px;

                        &:hover {
                            background: $lightred;
                        }

                        &:active {
                            background: $darkred;
                        }

                        &:disabled {
                            opacity:0.2;
                            cursor: inherit;
                        }
                    }

                }
            }
        }

    }
</style>