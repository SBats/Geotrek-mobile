'use strict';

function poisService($resource, $q, constants, settings, utils) {

	var self = this;

	this.trekPoisResource = $resource(settings.trekDir + ':trekId/' + constants.POI_FILE, { trekId: '@id' }, {
		query: {
			method: 'GET',
			cache: true
		}
	});
	this.poisResource = $resource(settings.poisUrl, {}, {
		query: {
			method: 'GET',
			cache: true
		}
	});


	this.pois = {};
	this.poisForTreks = {};

	this.makePoisArray = function (trekId) {
		var poisArray = [];

		angular.forEach(self.poisForTreks[trekId], function (poiId) {
			poisArray.push(self.pois[poiId]);
		});
		return (poisArray);
	};

	// Formats and save a poi
	this.savePoi = function (poi, trekId) {
		poi.properties.thumbnail = utils.getAbsoluteUrl(poi.properties.thumbnail);
		poi.properties.type.pictogram = utils.getAbsoluteUrl(poi.properties.type.pictogram);
		angular.forEach(poi.properties.pictures, function (picture) {
			picture.url = utils.getAbsoluteUrl(picture.url, trekId);
		});
		self.pois[poi.id] = poi;
	};

	this.getTrekPois = function (trekId) {
		var deferred = $q.defer();

		if (!self.poisForTreks[trekId]) {
		}

		self.trekPoisResource.query({ trekId: trekId }).$promise
		.then(function (file) {
			var trekPois = angular.fromJson(file);

			self.poisForTreks[trekId] = [];
			angular.forEach(trekPois.features, function (poi) {
				self.poisForTreks[trekId].push(poi.id);
				if (!self.pois[poi.id]) {
					self.savePoi(poi, trekId);
				}
			});
			deferred.resolve(self.makePoisArray(trekId));
		});
		return (deferred.promise);
	};

	// Returns the poi corresponding to the given id
	this.getPoi = function (poiId, trekId) {
		var deferred = $q.defer();

		if (self.pois[poiId]) {
			deferred.resolve(self.pois[poiId]);
		}
		else {
			self.getTrekPois(trekId).then(function (pois) {
				deferred.resolve(self.pois[poiId]);
			});
		}
		return (deferred.promise);
	};
}

module.exports = {
	poisService: poisService
};