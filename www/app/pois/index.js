'use strict';

window.angular.module('app.pois', [])

.controller('PoiController', require('./controllers').poiController)

.service('PoisService', require('./services').poisService)

.config(require('./routes').poiRoutes);
