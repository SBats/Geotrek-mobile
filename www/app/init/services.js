'use strict';

function initService($state, $q, $cordovaNetwork, $cordovaFile, settings, constants, utils, LanguageService, TreksFactory, LeafletService) {

	/**
	 * Check for updates for each downloaded trek's specific files
	 */
	function updateTreks(translations) {
		var deferred = $q.defer();
		var promises = [];

		deferred.notify(translations['init.updating_treks']);
		TreksFactory.getDownloadedTreks().then(function (treks) {

			angular.forEach(treks, function (trek) {
				promises.push = TreksFactory.downloadTrek(trek.id);
			});
			$q.all(promises).then(function (res) {
				deferred.resolve('updated');
			});
		});
		return (deferred.promise);
	}

	/**
	 * Downloads global treks and tiles files. Initializes languague.
	 */
	this.getDeviceFiles = function (translations) {
		var deferred = $q.defer();

		document.addEventListener('deviceready', onDeviceReady, false);

		function onDeviceReady() {

			deferred.notify(translations['init.loading_translations']);
			LanguageService.applyTreksLang().then(function (res) {
				LanguageService.applyInterfaceLang();

				if ($cordovaNetwork.isOffline()) {
					settings.isConnected = false;
					settings.leafletBackgroundUrl = settings.tilesDir + '/' + constants.GLOBAL_DIR + '/{z}/{x}/{y}.png';
					deferred.resolve(constants.DISCONNECTED_REDIRECTION);
				}
				else {

					if ($cordovaNetwork.getNetwork === 'wifi' || window.localStorage.syncMode === 'all') {

						// Downloads the .zip containing the main geojson and the tiles
						deferred.notify(translations['init.loading_treks']);
						utils.downloadAndUnzip(settings.globalTrekZipUrl, settings.treksDir + '/' + constants.GLOBAL_DIR, constants.GLOBAL_ZIP)
						.then(function (downloadRes) {

							deferred.notify(translations['init.loading_tiles']);
							utils.downloadAndUnzip(settings.globalTilesZipUrl, settings.tilesDir + '/' + constants.GLOBAL_DIR, constants.GLOBAL_ZIP)
							.then(function (downloadRes) {

								updateTreks(translations).then(function (res) {
									deferred.notify(translations['init.done']);
									deferred.resolve(constants.CONNECTED_REDIRECTION);
								});
							}, function (error) {
								console.log(error);
							});

						}, function (error) {
							console.log(error);
						});
					}
					else {
						deferred.resolve(constants.CONNECTED_REDIRECTION);
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