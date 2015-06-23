'use strict';

window.angular.module('app.init', [])

.controller('InitController', require('./controllers').initController)

.service('InitService', require('./services').initService)

.config(require('./routes').initRoutes);