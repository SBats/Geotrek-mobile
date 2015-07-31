'use strict';

function initService($state, $q, $cordovaNetwork, $cordovaFile, settings, constants, utils, LanguageService, TreksService) {

	function updateTreks() {
		var deferred = $q.defer();
		var promises = [];

		deferred.notify('Updating downloaded treks');
		TreksService.getDownloadedTreks().then(function (treks) {

			angular.forEach(treks, function (trek) {
				promises.push = TreksService.downloadTrek(trek.id);
			});
			$q.all(promises).then(function (res) {
				deferred.resolve('updated');
			});
		});
		return (deferred.promise);
	}

	this.getDeviceFiles = function () {
		var deferred = $q.defer();

		document.addEventListener('deviceready', onDeviceReady, false);

		function onDeviceReady() {

			deferred.notify('Loading translations');
			LanguageService.applyTreksLang().then(function (res) {
				LanguageService.applyInterfaceLang();

				console.log($cordovaNetwork.getNetwork());
				if ($cordovaNetwork.isOffline()) {
					settings.isConnected = false;
					settings.leafletBackgroundUrl = settings.tilesDir + '/' + constants.GLOBAL_DIR + '/{z}/{x}/{y}.png';
					deferred.resolve(constants.DISCONNECTED_REDIRECTION);
				}
				else {

					if ($cordovaNetwork.getNetwork === 'wifi' || window.localStorage.syncMode === 'all') {
						// Downloads the .zip containing the main geojson and the tiles
						deferred.notify('Loading treks');
						utils.downloadAndUnzip(settings.globalTrekZipUrl, settings.treksDir + '/' + constants.GLOBAL_DIR, constants.GLOBAL_ZIP)
						.then(function (downloadRes) {

							deferred.notify('Loading tiles');
							utils.downloadAndUnzip(settings.globalTilesZipUrl, settings.tilesDir + '/' + constants.GLOBAL_DIR, constants.GLOBAL_ZIP)
							.then(function (downloadRes) {

								updateTreks().then(function (res) {
									deferred.notify('Done');
									deferred.resolve(constants.CONNECTED_REDIRECTION);
								});
							}, function (error) {
								console.log(error);
							});

						}, function (error) {
							console.log(error);
						});
					}
				}
			});
		}
		return (deferred.promise);
	};
}

module.exports = {
	initService: initService
};