/*global StatusBar*/

'use strict';

var geotrekApp = angular.module('geotrekMobileApp',
    ['ionic', 'ngResource', 'ui.router', 'ui.bootstrap.buttons', 'geotrekTreks',
     'geotrekPois', 'geotrekMap', 'geotrekInit', 'geotrekGeolocation', 'ngCordova']);


// Wait for 'deviceready' Cordova event
window.ionic.Platform.ready(function() {
    if(window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
    }

    // Now launch the app
    angular.bootstrap(document, ['geotrekMobileApp']);

});

geotrekApp.config(['$urlRouterProvider', '$compileProvider', '$logProvider', function($urlRouterProvider, $compileProvider, $logProvider) {
    $urlRouterProvider.otherwise('/trek');
    // Root url is defined in init module

    $logProvider.debugEnabled = true;

    // Add cdvfile to allowed protocols in ng-src directive
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile):|data:image\//);

}])
.run(['$rootScope', '$log', 'geolocationFactory', function($rootScope, $log, geolocationFactory) {
    $rootScope.$on('$stateChangeError', function (evt, to, toParams, from, fromParams, error) {
        if (!!window.cordova) {
            if (error.message) {
                console.error('$stateChangeError : ' + error.message);
            } else {
                console.error('$stateChangeError : ' + JSON.stringify(error));
            }
        } else {
            console.error('$stateChangeError :', error);
        }
    });

    geolocationFactory.getLatLonPosition()
    .then(function(result) {
        console.log(result);
    }).catch(function(error) {
        console.log(error);
    });

    $rootScope.network = 'online';

    function onlineCallback() {
        $log.info('online');
        $rootScope.network = 'online';
        $rootScope.$digest();
    }

    function offlineCallback() {
        $log.info('offline');
        $rootScope.network = 'offline';
        $rootScope.$digest();
    }

    document.addEventListener("online", onlineCallback, false);
    document.addEventListener("offline", offlineCallback, false);
}]);
