'use strict';

window.angular.module('app.map', [])

.controller('MapController', require('./controllers').mapController)
.controller('LeafletMapController', require('./controllers').leafletMapController)

.service('LeafletService', require('./services').leafletService)
.service('IconsService', require('./services').iconsService)

.directive('geotrekMap', require('./directives').leafletMapDirective)

.config(require('./routes').mapRoutes);