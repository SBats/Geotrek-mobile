 'use strict';

function initService($state, $q, $cordovaNetwork, $cordovaFile, settings, constants, utils) {

	this.getDeviceFiles = function () {
		var deferred = $q.defer();

		document.addEventListener("deviceready", onDeviceReady, false);

		function onDeviceReady() {

			// Sets the good paths in the settings
			settings.cdvRoot = cordova.file.dataDirectory;
			settings.cdvRoot = settings.cdvRoot.substr(0, settings.cdvRoot.length - 1);

			settings.treksDir = settings.cdvRoot + '/' + settings.treksDir;
			settings.tilesDir = settings.cdvRoot + '/' + settings.tilesDir;
			settings.treksUrl = settings.cdvRoot + '/' + settings.treksUrl;
			settings.poisUrl = settings.cdvRoot + '/' + settings.poisUrl;
			settings.trekDir = settings.cdvRoot + '/' + settings.trekDir;
			settings.flatUrl = settings.cdvRoot + '/' + settings.flatUrl;

			if ($cordovaNetwork.isOffline()) {
				settings.isConnected = false;
				settings.leafletBackgroundUrl = settings.tilesDir + '/' + constants.GLOBAL_DIR + '/{z}/{x}/{y}.png';
				deferred.resolve(constants.DISCONNECTED_REDIRECTION);
			}
			else {
				// Downloads the .zip containing the main geojson and the tiles
				utils.downloadAndUnzip(settings.globalTrekZipUrl, settings.treksDir + '/' + constants.GLOBAL_DIR, constants.GLOBAL_ZIP)
				.then(function (downloadRes) {

					utils.downloadAndUnzip(settings.globalTilesZipUrl, settings.tilesDir + '/' + constants.GLOBAL_DIR, constants.GLOBAL_ZIP)
					.then(function (downloadRes) {
						deferred.resolve(constants.CONNECTED_REDIRECTION);
					}, function (error) {
						console.log(error);
					});

				}, function (error) {
					console.log(error);
				});
			}
		}
		return (deferred.promise);
	};
}

module.exports = {
	initService: initService
};