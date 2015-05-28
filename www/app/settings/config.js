'use strict';

var settingsConstants = {

	API_URL: 'http://prod-geotrek-fr.makina-corpus.net',

	// PATHS AND DIRECTORY //
    //
    //

    API_DIR: 'api',
    TREKS_DIR: 'treks',
    TREKS_FILE: 'treks.geojson',
    POI_FILE: 'pois.geojson',
    FLAT_FILE: 'flatpages.geojson',
    DEM_FILE: 'dem.json',
    PROFILE_FILE: 'profile.png',
    ZIP_DIR: 'zip',


    // LOCAL FILES AND DIRECTORIES //
    //
    //

    CDV_ROOT: 'cdvfile://localhost/persistent',
    GEOTREK_DIR: 'geotrek-mobile',
    GLOBAL_ZIP: 'data.tgz',

    leaflet : {
        GLOBAL_MAP_CENTER_LATITUDE: 42.83,
        GLOBAL_MAP_CENTER_LONGITUDE: 1.34,
        GLOBAL_MAP_DEFAULT_ZOOM: 10,
        GLOBAL_MAP_DEFAULT_MIN_ZOOM: 9,
        GLOBAL_MAP_DEFAULT_MAX_ZOOM: 14,

        DETAILED_MAP_DEFAULT_ZOOM: 12,
        DETAILED_MAP_DEFAULT_MIN_ZOOM: 11,
        DETAILED_MAP_DEFAULT_MAX_ZOOM: 14,

        GLOBAL_MAP_ATTRIBUTION: '(c) IGN Geoportail',
        TREK_COLOR: '#F89406',

        LEAFLET_BACKGROUND_URL: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    },



    FORCE_DOWNLOAD: false
};

function settingsFactory($window, constants) {

    var treksUrl, trekUrl, flatUrl;
    // var isDevice = angular.isDefined($window.cordova);
    var isDevice = true;

    var globalZipUrl = constants.API_URL + '/' + constants.ZIP_DIR + '/' + constants.TREKS_DIR + '/fr/' + constants.GLOBAL_ZIP;
    var globalZipLocation = constants.GEOTREK_DIR;

    if (isDevice) {
        treksUrl =  constants.GEOTREK_DIR + '/' + constants.API_DIR + '/fr/' + constants.TREKS_FILE;
        trekUrl =  constants.GEOTREK_DIR + '/' + constants.API_DIR + '/fr/' + constants.TREKS_DIR + '/';
        flatUrl =  constants.GEOTREK_DIR + '/' + constants.API_DIR + '/fr/' + constants.FLAT_FILE;
    }
    else {
        treksUrl =  constants.API_URL + '/' + constants.API_DIR + '/fr/' + constants.TREKS_FILE;
        trekUrl =  constants.API_URL + '/' + constants.API_DIR + '/fr/' + constants.TREKS_DIR + '/';
        flatUrl =  constants.API_URL + '/' + constants.API_DIR + '/fr/' + constants.FLAT_FILE;

        var TILES_REMOTE_PATH_URL = constants.API_URL + '/files/tiles';
        var MAP_GLOBAL_BACKGROUND_REMOTE_FILE_URL = constants.API_URL + '/files/tiles/global.zip';
    }

    return ({

		//PUBLIC VAR
        poiFile: constants.POI_FILE,
        profileFile: constants.PROFILE_FILE,
        isDevice: isDevice,

        apiUrl: constants.API_URL,
        treksUrl: treksUrl,
        trekUrl: trekUrl,
        flatUrl: flatUrl,
        globalZipUrl: globalZipUrl,
        globalZipLocation: globalZipLocation,

        forceDownload: constants.FORCE_DOWNLOAD

    });
}

module.exports = {
    settingsConstants: settingsConstants,
    settingsFactory: settingsFactory
};