'use strict';

window.angular.module('app.settings', [])

.constant('constants', require('./config').settingsConstants)

.factory('settings', require('./factories').settingsFactory);