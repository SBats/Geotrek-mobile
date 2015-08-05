'use strict';

function languageService($q, $cordovaGlobalization, $translate, constants, settings) {

	var self = this;

	this.setInterfaceLang = function(lang) {
		window.localStorage.interfaceLang = lang;
	};

	this.setTreksLang = function(lang) {
		window.localStorage.treksLang = lang;
	};

	/**
	 * Gets the navigator or device language
	 */
	this.detectLang = function() {
		var deferred = $q.defer();
		var lang;

		if (settings.isDevice) {
			$cordovaGlobalization.getPreferredLanguage().then(function (res) {
				lang = res.value.substr(0, 2);

				window.localStorage.interfaceLang = lang;
				window.localStorage.treksLang = lang;
				deferred.resolve(lang);
			});
		}
		else {
			lang = navigator.language || navigator.userLanguage;

			lang = lang.substr(0, 2);
			window.localStorage.interfaceLang = lang;
			window.localStorage.treksLang = lang;
			deferred.resolve(lang);
		}

		return (deferred.promise);
	};

	this.getInterfaceLang = function() {
		var deferred = $q.defer();

		if (angular.isDefined(window.localStorage.interfaceLang)) {
			deferred.resolve(window.localStorage.interfaceLang);
		}
		else {
			return (self.detectLang());
		}

		return (deferred.promise);
	};

	this.getTreksLang = function() {
		var deferred = $q.defer();

		if (angular.isDefined(window.localStorage.treksLang)) {
			deferred.resolve(window.localStorage.treksLang);
		}
		else {
			return (self.detectLang());
		}

		return (deferred.promise);
	};

	/**
	 * Change the paths where to find the differents files.
	 */
	this.applyTreksLang = function() {
		var deferred = $q.defer();

		self.getTreksLang().then(function (lang) {

			if (!settings.isDevice) {
				settings.filesUrl = constants.API_URL;
			}
			else {
				settings.cdvRoot = cordova.file.dataDirectory;
				settings.cdvRoot = settings.cdvRoot.substr(0, settings.cdvRoot.length - 1);

				settings.globalTrekZipUrl = constants.API_URL + '/' + constants.ZIP_DIR + '/' + constants.TREKS_DIR + '/' + lang + '/' + constants.GLOBAL_ZIP;
				settings.trekZipUrl = constants.API_URL + '/' + constants.ZIP_DIR + '/' + constants.TREKS_DIR + '/' + lang + '/';
				settings.globalTilesZipUrl = constants.API_URL + '/' + constants.ZIP_DIR + '/' + constants.TILES_DIR + '/' + constants.GLOBAL_ZIP;
				settings.tilesZipUrl = constants.API_URL + '/' + constants.ZIP_DIR + '/' + constants.TILES_DIR + '/';

				settings.treksDir = settings.cdvRoot + '/' + constants.TREKS_DIR;
				settings.tilesDir = settings.cdvRoot + '/' + constants.TILES_DIR;

				settings.filesUrl = settings.cdvRoot + '/' + constants.TREKS_DIR + '/' + constants.GLOBAL_DIR;
			}

			settings.treksUrl = settings.filesUrl + '/' + constants.API_DIR + '/' + lang + '/' + constants.TREKS_FILE;
			settings.trekDir = settings.filesUrl + '/' + constants.API_DIR + '/' + lang + '/' + constants.TREKS_DIR + '/';
			settings.poisUrl = settings.filesUrl + '/' + constants.API_DIR + '/' + lang + '/' + constants.POI_FILE;
			settings.flatUrl = settings.filesUrl + '/' + constants.API_DIR + '/' + lang + '/' + constants.FLAT_FILE;

			deferred.resolve('ok');
		});

		return (deferred.promise);
	};

	this.applyInterfaceLang = function() {
		$translate.use(window.localStorage.interfaceLang);
	};
}

module.exports = {
	languageService: languageService
};