'use strict';

var controller = require('./controllers');

function initRoutes($stateProvider) {

    $stateProvider
        .state('root.init', {
            url: '/init',
            views : {
                'content' : {
                    template: require('./templates/init.html'),
                    controller: controller.initController
                }
            }
        });
}

module.exports = {
    initRoutes: initRoutes
};