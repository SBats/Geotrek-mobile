'use strict';

var settingsConstants = {

	API_URL: 'http://prod-rando-fr.makina-corpus.net/data',

	CONNECTED_REDIRECTION: 'root.global.map',
	DISCONNECTED_REDIRECTION: 'root.favorites',


	FILE_DOWNLOADED: 1,
	FILE_ALREADY_THERE: 2,

	TREK_DOWNLOADED: 1,
	TREK_DELETED: 2,

	// PATHS AND DIRECTORY //
	//
	//

	API_DIR: 'api',
	TREKS_DIR: 'treks',
	TILES_DIR: 'tiles',
	TREKS_FILE: 'treks.geojson',
	POI_FILE: 'pois.geojson',
	FLAT_FILE: 'flatpages.geojson',
	DEM_FILE: 'dem.json',
	PROFILE_FILE: 'profile.png',
	ZIP_DIR: 'zip',


	// LOCAL FILES AND DIRECTORIES //
	//
	//

	GLOBAL_ZIP: 'global.zip',
	GLOBAL_DIR: 'global',

	leaflet : {
		global : {
			LATITUDE: 42.83,
			LONGITUDE: 1.34,
			DEFAULT_ZOOM: 10,
			DEFAULT_MIN_ZOOM: 9,
			DEFAULT_MAX_ZOOM: 14
		},

		detailed : {
			LATITUDE: 42.83,
			LONGITUDE: 1.34,
			DEFAULT_ZOOM: 13,
			DEFAULT_MIN_ZOOM: 12,
			DEFAULT_MAX_ZOOM: 15
		},

		LEAFLET_BACKGROUND_URL: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

		GLOBAL_MAP_ATTRIBUTION: '(c) IGN Geoportail',
		TREK_COLOR: '#F89406'
	},



	FORCE_DOWNLOAD: false
};

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
	settingsConstants: settingsConstants,
	settingsFactory: settingsFactory
};