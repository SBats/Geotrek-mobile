
function treksFactory($injector, $resource, $http, $q, $cordovaFile, constants, settings, utils, PoisService, TreksRemoteService, TreksFileSystemService) {

	var treksResource = $resource(settings.treksUrl, {}, {
		query: {
			method: 'GET',
			cache: true
		}
	});
	var treks;

	/**
	 * Gets the absolute URLs for the given trek
	 */
	function replaceImgURLs(trek) {

		trek.properties.thumbnail = utils.getAbsoluteUrl(trek.properties.thumbnail);
		if (trek.properties.difficulty) {
			trek.properties.difficulty.pictogram = utils.getAbsoluteUrl(trek.properties.difficulty.pictogram);
		}
		if (trek.properties.practice) {
			trek.properties.practice.pictogram = utils.getAbsoluteUrl(trek.properties.practice.pictogram);
		}
		if (trek.properties.route) {
			trek.properties.route.pictogram = utils.getAbsoluteUrl(trek.properties.route.pictogram);
		}
		angular.forEach(trek.properties.information_desks, function (information_desk) {
			information_desk.photo_url = utils.getAbsoluteUrl(information_desk.photo_url);
		});
		angular.forEach(trek.properties.pictures, function (picture) {
			picture.url = utils.getAbsoluteUrl(picture.url, trek.id, trek.isDownloaded);
		});
	};

	/**
	 * Resolves the list of treks
	 *
	 * @param {bool} forceUpdate - if set to true, the function will update the treks, even if already saved
	 */
	var getTreks = function (forceUpdate) {
		var deferred = $q.defer();
		var tmpTreks;
		var promises = [];

		if (angular.isUndefined(forceUpdate)) {
			forceUpdate = false;
		}
		if (!forceUpdate && treks) {
			deferred.resolve(treks);
		}
		else {
			treksResource = $resource(settings.treksUrl, {}, { query: { method: 'GET', cache: true } });
			treksResource.query().$promise
			.then(function(file) {
				tmpTreks = angular.fromJson(file);
				treks = {};
				angular.forEach(tmpTreks.features, function (trek) {

					treks[trek.id] = trek;
					promises.push(isTrekDownloaded(trek.id));
					promises[promises.length - 1].then(function (res) {
						trek.isDownloaded = res;
						replaceImgURLs(trek);
					});
				});

				$q.all(promises)
				.then(function (res) {
					deferred.resolve(treks);
				});
			});
		}
		return (deferred.promise);
	};

	/**
	 * Resolves an array containing the downloaded treks
	 */
	var getDownloadedTreks = function () {
		var deferred = $q.defer();

		getTreks().then(function (treks) {

			var downloadedTreks = [];
			angular.forEach(treks, function (trek) {
				if (trek.isDownloaded) {
					downloadedTreks.push(trek);
				}
			});
			deferred.resolve(downloadedTreks);
		});
		return (deferred.promise);
	};

	/**
	 * Resolves the trek corresponding to the given Id
	 */
	var getTrek = function (trekId) {
		var deferred = $q.defer();

		trekId = Number(trekId);
		this.getTreks().then(function (treks) {
			if (angular.isDefined(treks[trekId])) {
				deferred.resolve(treks[trekId]);
			}
			else {
				deferred.reject("Trek not found");
			}
		});
		return (deferred.promise);
	};

	/**
	 *	Get the downloaded treks and calls the POI service function to update POIs
	 */
	function updateDownloadedPois() {

		getDownloadedTreks().then(function (treks) {
			PoisService.getDownloadedPois(treks, true);
		});
	}

	var isTrekDownloaded = (settings.isDevice ? TreksFileSystemService.isTrekDownloaded : TreksRemoteService.isTrekDownloaded);
	
	var downloadTrek = function(trekId) {
		var promise;

		promise = (settings.isDevice ? TreksFileSystemService.downloadTrek(treks, trekId) : TreksRemoteService.downloadTrek(treks, trekId));
		promise.then(function (res) {
			updateDownloadedPois();
		});
		return (promise);
	};
	
	var deleteTrek = function(trekId) {
		var promise;

		promise = (settings.isDevice ? TreksFileSystemService.deleteTrek(treks, trekId) : TreksRemoteService.deleteTrek(treks, trekId));
		promise.then(function (res) {
			updateDownloadedPois();
		});
		return (promise);
	};

	return ({
		getTreks: getTreks,
		getTrek: getTrek,
		getDownloadedTreks: getDownloadedTreks,
		isTrekDownloaded: isTrekDownloaded,
		downloadTrek: downloadTrek,
		deleteTrek: deleteTrek
	});
}

module.exports = {
	treksFactory: treksFactory
};