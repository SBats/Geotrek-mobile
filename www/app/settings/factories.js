'use strict';

function settingsFactory($window, constants) {

	var treksUrl = constants.API_DIR + '/fr/' + constants.TREKS_FILE,
		trekDir = constants.API_DIR + '/fr/' + constants.TREKS_DIR + '/',
		flatUrl = constants.API_DIR + '/fr/' + constants.FLAT_FILE,
		poisUrl = constants.API_DIR + '/fr/' + constants.POI_FILE;
	var isDevice = angular.isDefined($window.cordova);
	var cdvRoot = '';
	var leafletBackgroundUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

	if (isDevice) {
		var globalTrekZipUrl = constants.API_URL + '/' + constants.ZIP_DIR + '/' + constants.TREKS_DIR + '/fr/' + constants.GLOBAL_ZIP;
		var trekZipUrl = constants.API_URL + '/' + constants.ZIP_DIR + '/' + constants.TREKS_DIR + '/fr/';
		var globalTilesZipUrl = constants.API_URL + '/' + constants.ZIP_DIR + '/' + constants.TILES_DIR + '/' + constants.GLOBAL_ZIP;
		var tilesZipUrl = constants.API_URL + '/' + constants.ZIP_DIR + '/' + constants.TILES_DIR + '/';
		var placeHolder = 'lol';

		var treksDir = constants.TREKS_DIR;
		var tilesDir = constants.TILES_DIR;

		treksUrl = treksDir + '/' + constants.GLOBAL_DIR + '/' + treksUrl;
		poisUrl = treksDir + '/' + constants.GLOBAL_DIR + '/' + poisUrl;
		trekDir = treksDir + '/' + constants.GLOBAL_DIR + '/' + trekDir;
		flatUrl = treksDir + '/' + constants.GLOBAL_DIR + '/' + flatUrl;
	}
	else {
		treksUrl =  constants.API_URL + '/' + treksUrl;
		poisUrl =  constants.API_URL + '/' + poisUrl;
		trekDir =  constants.API_URL + '/' + trekDir;
		flatUrl =  constants.API_URL + '/' + flatUrl;
	}

	return ({

		//PUBLIC VAR
		poiFile: constants.POI_FILE,
		profileFile: constants.PROFILE_FILE,
		isDevice: isDevice,
		isConnected: true,
		cdvRoot: cdvRoot,

		apiUrl: constants.API_URL,
		treksUrl: treksUrl,
		poisUrl: poisUrl,
		trekDir: trekDir,
		flatUrl: flatUrl,
		globalTrekZipUrl: globalTrekZipUrl,
		trekZipUrl: trekZipUrl,
		globalTilesZipUrl: globalTilesZipUrl,
		tilesZipUrl: tilesZipUrl,
		treksDir: treksDir,
		tilesDir: tilesDir,

		leafletBackgroundUrl: leafletBackgroundUrl,

		forceDownload: constants.FORCE_DOWNLOAD

	});
}

module.exports = {
	settingsFactory: settingsFactory
};