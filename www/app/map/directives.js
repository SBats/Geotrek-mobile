'use strict';

var controllers = require('./controllers');

function leafletMapDirective() {
	return {
		restrict: 'E',
		replace: true,
		controller: controllers.mapDirectiveController,
		template: require('./templates/map_directive.html')
	};
}

module.exports = {
	leafletMapDirective: leafletMapDirective
};