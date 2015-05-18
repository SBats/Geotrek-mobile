'use strict';

var controllers = require('./controllers');

function leafletMapDirective() {
	return {
		restrict: 'E',
		replace: false,
		scope: {
			view: '@',
			trekId: '@'
		},
		controller: controllers.leafletMapController,
		template: require('./templates/leaflet_map.html')
	};
}

module.exports = {
	leafletMapDirective: leafletMapDirective
};