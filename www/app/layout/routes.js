'use strict';

var controller = require('./controllers');

function layoutRoutes($locationProvider, $stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.views.transition('none');
    $urlRouterProvider.otherwise('/map');

    $stateProvider
        .state('root', {
            abstract: true,
            url: '',
            template: require('./templates/layout.html'),
            controller: controller.LayoutController
        });
}

module.exports = {
    layoutRoutes: layoutRoutes
};