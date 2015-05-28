'use strict';

window.angular.module('app.map', [])

.controller('MapController', require('./controllers').mapController)
.controller('GlobalMapController', require('./controllers').globalMapController)
.controller('DetailedMapController', require('./controllers').detailedMapController)
.controller('MapDirectiveController', require('./controllers').mapDirectiveController)

.service('LeafletService', require('./services').leafletService)
.service('IconsService', require('./services').iconsService)

.directive('geotrekMap', require('./directives').leafletMapDirective)

.config(require('./routes').mapRoutes);