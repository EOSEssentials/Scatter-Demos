<template>
    <aside class="sidebar">

        <section class="logo-panel">
            <figure class="logo">Scatter Demos</figure>
            <figure class="description">
                This site aims to inform users and developers about
                integration with Scatter, eosjs, and EOS in general.
            </figure>
        </section>

        <router-link :to="{name:routeNames.INDEX}" class="link" :class="{}">Getting Started</router-link>
        <router-link :to="{name:routeNames.SHOPPING}" class="link">Shopping</router-link>
    </aside>
</template>

<script>
    import { mapActions, mapGetters, mapState } from 'vuex'
    import * as Actions from '../store/constants';
    import {RouteNames} from '../vue/Routing'

    export default {
        data(){ return {
            routeNames:RouteNames
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
    .sidebar {
        width:300px;
        position:absolute;
        top:0;
        bottom:0;
        left:0;
        background:#f23c3c;
        float:left;

        .logo-panel {
            padding:30px;
            color:#fff;

            .logo {
                font-family: 'Grand Hotel', sans-serif;
                font-size:36px;
            }

            .description {
                font-size:9px;
                opacity:0.8;
            }
        }

        .link {
            cursor: pointer;
            height:40px;
            line-height:40px;
            width:100%;
            font-size:18px;
            color:#fff;
            padding:0 30px;
            transition:background 0.2s ease;

            &:hover, &.router-link-exact-active {
                background:#f64444;
            }

            &:not(.router-link-exact-active):active {
                background:#e43535;
            }
        }
    }
</style>