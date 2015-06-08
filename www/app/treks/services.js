'use strict';

function treksService($resource, $http, $q, constants, settings, utils) {

	var treksResource = $resource(settings.treksUrl, {}, {
		query: {
			method: 'GET',
			cache: true
		}
	});
	var self = this;

	this.getTreks = function () {
		var deferred = $q.defer();

		if (self.treks) {
			deferred.resolve(self.treks);
		}

		treksResource.query().$promise
		.then(function(file) {
			self.treks = angular.fromJson(file);
			angular.forEach(self.treks.features, function (trek) {
				trek.properties.thumbnail = utils.getAbsoluteUrl(trek.properties.thumbnail);
				trek.properties.difficulty.pictogram = utils.getAbsoluteUrl(trek.properties.difficulty.pictogram);
				if (trek.properties.practice) {
					trek.properties.practice.pictogram = utils.getAbsoluteUrl(trek.properties.practice.pictogram);
				}
				trek.properties.route.pictogram = utils.getAbsoluteUrl(trek.properties.route.pictogram);
				angular.forEach(trek.properties.pictures, function (picture) {
					picture.url = utils.getAbsoluteUrl(picture.url);
				});
			});
			deferred.resolve(self.treks);
		});

		return (deferred.promise);
	};

	this.getTrek = function (trekId) {
		var deferred = $q.defer();

		this.getTreks().then(function (treks) {
			angular.forEach(treks.features, function(trek) {
				if (trek.id.toString() === trekId) {
					deferred.resolve(trek);
				}
			});
			deferred.reject("Trek not found");
		});
		return (deferred.promise);
	};
}

module.exports = {
	treksService: treksService
};