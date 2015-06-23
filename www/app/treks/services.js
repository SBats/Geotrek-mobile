'use strict';

function treksService($resource, $http, $q, $cordovaFile, constants, settings, utils) {

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
				angular.forEach(trek.properties.information_desks, function (information_desk) {
					information_desk.photo_url = utils.getAbsoluteUrl(information_desk.photo_url);
				});
				angular.forEach(trek.properties.pictures, function (picture) {
					picture.url = utils.getAbsoluteUrl(picture.url, trek.id);
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

	this.downloadTrek = function (trekId) {

		utils.downloadAndUnzip(settings.trekZipUrl + trekId + '.zip', settings.treksDir + '/' + trekId, trekId + '.zip')
		.then(function (downloadRes) {

			utils.downloadAndUnzip(settings.tilesZipUrl + trekId + '.zip', settings.tilesDir + '/' + trekId, trekId + '.zip')
			.then(function (success) {
				alert('Trek téléchargé');
			}, function (error) {
				console.log(error);
			});

		}, function (error) {
			console.log(error);
		});
	};

	this.deleteTrek = function (trekId) {

		$cordovaFile.removeRecursively(settings.treksDir, String(trekId))
		.then(function (success) {

			$cordovaFile.removeRecursively(settings.tilesDir, String(trekId))
			.then(function (success) {
				alert('Trek supprimé');
			}, function (error) {
				console.log(error);
			});

		}, function (error) {
			console.log(error);
		});
	};

	this.deleteOrDownload = function (trekId) {
		var deferred = $q.defer();

		$cordovaFile.checkDir(settings.treksDir + '/', String(trekId))
		.then(function (success) {
			self.deleteTrek(trekId);
			deferred.resolve(constants.TREK_DELETED);
		}, function (error) {
			self.downloadTrek(trekId);
			deferred.resolve(constants.TREK_DOWNLOADED);
		});

		return (deferred.promise);
	};

	this.isTrekDownloaded = function (trekId) {
		var deferred = $q.defer();

		$cordovaFile.checkDir(settings.treksDir + '/', String(trekId))
		.then(function (success) {
			deferred.resolve(true);
		}, function (error) {
			deferred.resolve(false);
		});

		return (deferred.promise);
	};

}

module.exports = {
	treksService: treksService
};