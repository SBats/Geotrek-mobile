'use strict';

var dependencies = [
  'ionic',
  'ngResource',

  'app.layout',
  'app.settings',
  'app.commons',
  'app.filters',
  'app.treks',
  'app.map',
  'app.favorites',
  'app.list_display',
  'app.detailed_trek'
];

window.L = require('leaflet');

angular.module('app', dependencies)
  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });

require('./layout');
require('./settings');
require('./commons');
require('./filters');
require('./treks');
require('./map');
require('./favorites');
require('./list_display');
require('./detailed_trek');