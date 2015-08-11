'use strict';

function poisService($resource, $q, constants, settings, utils) {

	var self = this;

	self.trekPoisResource = $resource(settings.trekDir + ':trekId/' + constants.POI_FILE, { trekId: '@id' }, {
		query: {
			method: 'GET',
			cache: true
		}
	});

	self.pois = {};
	self.poisForTreks = {};

	/**
	 * Creates an array containing the downloaded POIs' id, and resolves the downloaded POIs
	 *
	 * @param {array} treks - Array of the downloaded treks
	 * @param {bool} forceUpdate
	 */
	this.getDownloadedPois = function (treks, forceUpdate) {
		var deferred = $q.defer();
		var downloadedPoisRet = [];
		var promises = [];

		if (angular.isUndefined(forceUpdate)) {
			forceUpdate = false;
		}
		if (angular.isDefined(self.downloadedPois) && forceUpdate === false) {
			angular.forEach(self.downloadedPois, function (poiId) {
				downloadedPoisRet.push(self.pois[poiId]);
			});
			deferred.resolve(downloadedPoisRet);
		}
		else {
			self.downloadedPois = [];
			angular.forEach(treks, function (trek) {

				promises.push(self.getTrekPois(trek.id));
				promises[promises.length - 1].then(function (pois) {
					angular.forEach(pois, function (poi) {

						if (!(self.downloadedPois.indexOf(poi.id) > -1)) {
							self.downloadedPois.push(poi.id);
						}
					});
				});
			});
			$q.all(promises).then(function (res) {
				angular.forEach(self.downloadedPois, function (poiId) {
					downloadedPoisRet.push(self.pois[poiId]);
				});
			});
		}
		return (deferred.promise);
	};

	/**
	 * Returns an array containing the POIs for the given trek
	 */
	this.makePoisArray = function (trekId) {
		var poisArray = [];

		angular.forEach(self.poisForTreks[trekId], function (poiId) {
			poisArray.push(self.pois[poiId]);
		});
		return (poisArray);
	};

	/**
	 * Formats and save a poi
	 */
	this.savePoi = function (poi, trekId) {
		poi.properties.thumbnail = utils.getAbsoluteUrl(poi.properties.thumbnail);
		poi.properties.type.pictogram = utils.getAbsoluteUrl(poi.properties.type.pictogram);
		angular.forEach(poi.properties.pictures, function (picture) {
			picture.url = utils.getAbsoluteUrl(picture.url, trekId);
		});
		self.pois[poi.id] = poi;
	};

	/**
	 * Gets the POIs of the given trek
	 */
	this.getTrekPois = function (trekId) {
		var deferred = $q.defer();

		self.trekPoisResource = $resource(settings.trekDir + ':trekId/' + constants.POI_FILE, { trekId: '@id' }, {
			query: {
				method: 'GET',
				cache: true
			}
		});
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

	/**
	 * Returns the poi corresponding to the given id
	 */
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