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


    // LOCAL STUFF //
    //
    //

    CDV_ROOT: 'cdvfile://localhost/persistent',
    GEOTREK_DIR: 'geotrek-mobile',



    FORCE_DOWNLOAD: false

};

function settingsFactory($window, constants) {

    var treksUrl, trekUrl, flatUrl;

    if (angular.isDefined($window.cordova)) {
        treksUrl =  constants.GEOTREK_DIR + '/' + constants.API_DIR + '/fr/' + constants.TREKS_FILE;
        trekUrl =  constants.GEOTREK_DIR + '/' + constants.API_DIR + '/fr/' + constants.TREKS_DIR + '/';
        flatUrl =  constants.GEOTREK_DIR + '/' + constants.API_DIR + '/fr/' + constants.FLAT_FILE;
    }
    else {
        treksUrl =  constants.API_URL + '/' + constants.API_DIR + '/fr/' + constants.TREKS_FILE;
        trekUrl =  constants.API_URL + '/' + constants.API_DIR + '/fr/' + constants.TREKS_DIR + '/';
        flatUrl =  constants.API_URL + '/' + constants.API_DIR + '/fr/' + constants.FLAT_FILE;
    }

    var leaflet_conf = {
        GLOBAL_MAP_CENTER_LATITUDE: 42.83,
        GLOBAL_MAP_CENTER_LONGITUDE: 1.34,
        GLOBAL_MAP_DEFAULT_ZOOM: 9,
        GLOBAL_MAP_DEFAULT_MIN_ZOOM: 9,
        GLOBAL_MAP_DEFAULT_MAX_ZOOM: 14,
        GLOBAL_MAP_ATTRIBUTION: '(c) IGN Geoportail',
        TREK_COLOR: '#F89406',

        TILES_REMOTE_PATH_URL: constants.API_URL + '/files/tiles',
        MAP_GLOBAL_BACKGROUND_REMOTE_FILE_URL: constants.API_URL + '/files/tiles/global.zip',
        LEAFLET_BACKGROUND_URL: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    };

    return ({

		//PUBLIC VAR
        poiFile: constants.POI_FILE,
        profileFile: constants.PROFILE_FILE,

        apiUrl: constants.API_URL,
        treksUrl: treksUrl,
        trekUrl: trekUrl,
        flatUrl: flatUrl,

        leaflet: leaflet_conf,

        forceDownload: constants.FORCE_DOWNLOAD

    });
}

module.exports = {
    settingsConstants: settingsConstants,
    settingsFactory: settingsFactory
};