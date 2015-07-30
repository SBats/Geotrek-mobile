'use strict';

function settingsFactory($window, constants, $cordovaGlobalization) {

	var isDevice = angular.isDefined($window.cordova);
	var leafletBackgroundUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

	var treksUrl, trekDir, flatUrl, poisUrl;

	if (!isDevice) {
		var lang = navigator.language || navigator.userLanguage;

		treksUrl = constants.API_URL + '/' + constants.API_DIR + '/' + lang + '/' + constants.TREKS_FILE;
		trekDir = constants.API_URL + '/' + constants.API_DIR + '/' + lang + '/' + constants.TREKS_DIR + '/';
		flatUrl = constants.API_URL + '/' + constants.API_DIR + '/' + lang + '/' + constants.FLAT_FILE;
		poisUrl = constants.API_URL + '/' + constants.API_DIR + '/' + lang + '/' + constants.POI_FILE;
	}

	var ret = {

		//PUBLIC VAR
		poiFile: constants.POI_FILE,
		profileFile: constants.PROFILE_FILE,
		isDevice: isDevice,
		isConnected: true,

		apiUrl: constants.API_URL,
		treksUrl: treksUrl,
		poisUrl: poisUrl,
		trekDir: trekDir,
		flatUrl: flatUrl,

		leafletBackgroundUrl: leafletBackgroundUrl,

		forceDownload: constants.FORCE_DOWNLOAD

	};
	return (ret);
}

module.exports = {
	settingsFactory: settingsFactory
};