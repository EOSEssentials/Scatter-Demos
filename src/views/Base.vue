<template>
    <section class="view-base">

        <figure class="back-left"></figure>
        <figure class="back-right"></figure>

        <main>
            <sidebar></sidebar>
            <section class="body">
                <router-view></router-view>
            </section>
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
    .view-base {
        position: relative;

        .back-left, .back-right {
            position:fixed;
            top:0;
            bottom:0;
            width:50%;
            z-index:-1;
        }

        .back-left { left:0; background:#e43535; }
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
                    font-size:11px;
                    font-weight: 400;
                    color:#6b6b6b;
                }

                .dev-link {
                    cursor: pointer;
                    margin-top:20px;
                    color:#f23c3c;
                    text-decoration: underline;
                    font-weight:bold;
                    display:inline-block;
                }

                span {
                    font-size:9px;
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
                        background:#f23c3c;
                        color:#fff;
                        font-size:16px;
                        transition:background 0.2s ease;
                        font-family: 'Raleway', sans-serif;
                        margin-top:20px;

                        &:hover {
                            background: #f64444;
                        }

                        &:active {
                            background: #e43535;
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