'use strict';

function utils() {

	var self = this;

	this.getStartPoint = function (element) {
		var firstPointCoordinates = [];

		if (element.geometry.type === 'Point') {
			firstPointCoordinates = element.geometry.coordinates;
		} else if (element.geometry.type === 'LineString') {
			firstPointCoordinates = element.geometry.coordinates[0];
		} else if (element.geometry.type === 'Polygon' || element.geometry.type === 'MultiLineString') {
			firstPointCoordinates = element.geometry.coordinates[0][0];
		}

		return ({
			'lat': firstPointCoordinates[1],
			'lng': firstPointCoordinates[0]
		});
	};

	this.getEndPoint = function (element) {
		var lastPointCoordinates = [];
		
		if (element.geometry.type === 'Point') {
			lastPointCoordinates = element.geometry.coordinates;
		} else if (element.geometry.type === 'LineString') {
			var nbPts = element.geometry.coordinates.length;
			lastPointCoordinates = element.geometry.coordinates[nbPts - 1];
		} else if (element.geometry.type === 'Polygon' || element.geometry.type === 'MultiLineString') {
			var nbLines = element.geometry.coordinates.length;
			var nbPts = element.geometry.coordinates[nbLines - 1].length;
			lastPointCoordinates = element.geometry.coordinates[nbLines - 1][nbPts - 1];
		}

		return ({
			'lat': lastPointCoordinates[1],
			'lng': lastPointCoordinates[0]
		});
	};

	this.createClusterMarkerFromTrek = function(trek) {
		var startPoint = self.getStartPoint(trek);

		var marker = L.marker([startPoint.lat, startPoint.lng], {
			icon: 'img/marker-source.png'
		});

		return (marker);
	};
}

module.exports = {
	utils: utils
};