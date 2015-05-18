'use strict';

function treksService($resource, $http, $q, settings) {

	var treksResource = $resource(settings.treksUrl, {}, {
		query: {
			method: 'GET',
			cache: true
		}
	}),
	self = this;

	this.getTreks = function () {
		var deferred = $q.defer();

		if (self.treks) {
			deferred.resolve(self.treks);
		}

		treksResource.query().$promise
		.then(function(file) {
			self.treks = angular.fromJson(file);
			angular.forEach(self.treks.features, function (trek) {
				trek.properties.thumbnail = settings.apiUrl + trek.properties.thumbnail;
			});
			deferred.resolve(self.treks);
		});

		return (deferred.promise);
	}

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
	}
}

module.exports = {
	treksService: treksService
};