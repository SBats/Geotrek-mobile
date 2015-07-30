'use strict';

window.angular.module('app.user_settings', [])

.controller('UserSettingsController', require('./controllers').userSettingsController)

.factory('UserSettingsFactories', require('./factories').userSettingsFactory)

.config(require('./routes').userSettingsRoutes);