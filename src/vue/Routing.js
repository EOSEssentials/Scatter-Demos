import GettingStarted from '../views/GettingStarted.vue'
import Shopping from '../views/Shopping.vue'
import SpaceInvaders from '../views/SpaceInvaders.vue'
import Paint from '../views/Paint.vue'

export const RouteNames = {
    INDEX:'index',
    SHOPPING:'shopping',
    SPACE_INVADERS:'spaceInvaders',
    PAINT:'paint',
};

const RouteViews = {
    [RouteNames.INDEX]:GettingStarted,
    [RouteNames.SHOPPING]:Shopping,
    [RouteNames.SPACE_INVADERS]:SpaceInvaders,
    [RouteNames.PAINT]:Paint,
};

export class Routing {

    static builder(){
        const routeNames = Object.keys(RouteNames).map(key => RouteNames[key]);

        let routesBuilder = {};
        routeNames.map(routeName => {
            routesBuilder[routeName] = {
                path:routeName === RouteNames.INDEX ? '' : '/'+routeName,
                name:routeName,
                component: RouteViews[routeName]
            }
        });

        return routesBuilder;
    }

    static routes(){
        return Object.keys(Routing.builder())
            .map(routeName => Routing.builder()[routeName]);
    }
}