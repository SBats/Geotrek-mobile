'use strict';

function treksService($resource, $http, $q, $cordovaFile, constants, settings, utils) {

	var treksResource = $resource(settings.treksUrl, {}, {
		query: {
			method: 'GET',
			cache: true
		}
	});
	var self = this;

	this.replaceImgURLs = function(trek) {

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
			picture.url = utils.getAbsoluteUrl(picture.url, trek.id, trek.isDownloaded);
		});
	};

	this.getTreks = function (forceUpdate) {
		var deferred = $q.defer();
		var promises = [];

		if (angular.isUndefined(forceUpdate)) {
			forceUpdate = false;
		}
		if (!forceUpdate && self.treks) {
			deferred.resolve(self.treks);
		}
		else {
			treksResource = $resource(settings.treksUrl, {}, { query: { method: 'GET', cache: true } });
			treksResource.query().$promise
			.then(function(file) {
				self.treks = angular.fromJson(file);
				angular.forEach(self.treks.features, function (trek) {

					promises.push(self.isTrekDownloaded(trek.id));
					promises[promises.length - 1].then(function (res) {
						trek.isDownloaded = res;
						self.replaceImgURLs(trek);
					});
				});

				$q.all(promises)
				.then(function (res) {
					deferred.resolve(self.treks);
				});
			});
		}
		return (deferred.promise);
	};

	this.getDownloadedTreks = function (trekId) {
		var deferred = $q.defer();

		self.getTreks().then(function (treks) {

			var downloadedTreks = [];
			angular.forEach(treks.features, function (trek) {
				if (trek.isDownloaded) {
					downloadedTreks.push(trek);
				}
			});
			deferred.resolve(downloadedTreks);
		});
		return (deferred.promise);
	};

	this.getTrek = function (trekId) {
		var deferred = $q.defer();

		this.getTreks().then(function (treks) {
			angular.forEach(treks.features, function(trek) {
				if (trek.id === Number(trekId)) {
					deferred.resolve(trek);
				}
			});
			deferred.reject("Trek not found");
		});
		return (deferred.promise);
	};

	this.setDownloadedValue = function(trekId, value) {

		this.getTreks().then(function (treks) {
			angular.forEach(treks.features, function(trek) {
				if (trek.id === Number(trekId)) {
					trek.isDownloaded = value;
				}
			});
		});
	};

	this.downloadTrek = function (trekId) {

		var deferred = $q.defer();

		utils.downloadAndUnzip(settings.trekZipUrl + trekId + '.zip', settings.treksDir + '/' + trekId, trekId + '.zip')
		.then(function (downloadRes) {

			utils.downloadAndUnzip(settings.tilesZipUrl + trekId + '.zip', settings.tilesDir + '/' + trekId, trekId + '.zip')
			.then(function (success) {
				self.setDownloadedValue(trekId, true);
				deferred.resolve('ok');
			}, function (error) {
				deferred.reject(error);
			}, function (progress) {
				deferred.notify(String((progress.loaded / progress.total) * 50 + 50) + '%');
			});

		}, function (error) {
			deferred.reject(error);
		}, function (progress) {
			deferred.notify(String((progress.loaded / progress.total) * 50) + '%');
		});
		return (deferred.promise);
	};

	this.deleteTrek = function (trekId) {

		var deferred = $q.defer();

		$cordovaFile.removeRecursively(settings.treksDir, String(trekId))
		.then(function (success) {

			$cordovaFile.removeRecursively(settings.tilesDir, String(trekId))
			.then(function (success) {
				self.setDownloadedValue(trekId, false);
				deferred.resolve('ok');
			}, function (error) {
				deferred.reject(error);
			});

		}, function (error) {
			deferred.reject(error);
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