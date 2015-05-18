'use strict';

function mapController() {
}

function leafletMapController($scope, LeafletService) {

	var map = LeafletService.getMap();

	if ($scope.view === 'global') {
		LeafletService.setGlobalSettings(map);
		LeafletService.placeGlobalMarkers(map);
	}

}

module.exports = {
	mapController: mapController,
	leafletMapController: leafletMapController
};