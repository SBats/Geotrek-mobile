'use strict';

function utils($http, $translate, $ionicPopup, $q, $cordovaNetwork, $cordovaFile, $cordovaFileTransfer, settings, constants, IconsService) {

	var self = this;

	/** 
	 * Returns an absolute URL from a relative URL
	 *
	 * @param {string} relativeUrl - The relative URL usually found in a var from treks.geojson
	 * @param {number} trekId - Optionnal, needed in case you are looking for a specific trek picture
	 * @param {bool} isTrekDownloaded - Needed in case trekId is specified
	 */
	this.getAbsoluteUrl = function (relativeUrl, trekId, isTrekDownloaded) {
		// If we are on a device and the resource is in the global files
		if (settings.isDevice && angular.isUndefined(trekId)) {
			return (settings.treksDir + '/' + constants.GLOBAL_DIR + relativeUrl);
		}
		// If we are connected on browser or we are browsing a trek page on a device
		else if (settings.isConnected) {
			return (settings.apiUrl + relativeUrl);
		}
		// If we are browsing a trek page on a device in disconnected mode
		else  if (angular.isDefined(trekId) && isTrekDownloaded) {
			return (settings.treksDir + '/' + trekId + relativeUrl);
		}
		// If we don't have any way to get the picture, we use the place holder
		else {
			return (settings.placeHolder);
		}
	};

	/**
	 * Returns the distance between two points
	 */
	this.getDistanceFromLatLonInKm = function(lat1,lon1,lat2,lon2) {
		var R = 6371; // Radius of the earth in km
		var dLat = deg2rad(lat2 - lat1);  // deg2rad below
		var dLon = deg2rad(lon2 - lon1);

		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
				Math.sin(dLon / 2) * Math.sin(dLon / 2);

		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c; // Distance in km
		
		return (d);
	};

	/**
	 * Converts an angle from deg to rad
	 */
	function deg2rad(deg) {
        return (deg * (Math.PI / 180));
    }

	/** 
	 * Returns the starting point of a geometry element
	 *
	 * @param element - The element of which you want to get the starting point
	 */
	this.getStartPoint = function (element) {
		var firstPointCoordinates = [];

		if (element.geometry.type === 'Point') {
			firstPointCoordinates = element.geometry.coordinates;
		} else if (element.geometry.type === 'LineString') {
			firstPointCoordinates = element.geometry.coordinates[0];
		} else if (element.geometry.type === 'Polygon' || element.geometry.type === 'MultiLineString') {
			firstPointCoordinates = element.geometry.coordinates[0][0];
		}

		return ({
			'lat': firstPointCoordinates[1],
			'lng': firstPointCoordinates[0]
		});
	};

	/** 
	 * Returns the ending point of a geometry element
	 *
	 * @param element - The element of which you want to get the ending point
	 */
	this.getEndPoint = function (element) {
		var lastPointCoordinates = [];
		
		if (element.geometry.type === 'Point') {
			lastPointCoordinates = element.geometry.coordinates;
		} else if (element.geometry.type === 'LineString') {
			var nbPts = element.geometry.coordinates.length;
			lastPointCoordinates = element.geometry.coordinates[nbPts - 1];
		} else if (element.geometry.type === 'Polygon' || element.geometry.type === 'MultiLineString') {
			var nbLines = element.geometry.coordinates.length;
			var nbPts = element.geometry.coordinates[nbLines - 1].length;
			lastPointCoordinates = element.geometry.coordinates[nbLines - 1][nbPts - 1];
		}

		return ({
			'lat': lastPointCoordinates[1],
			'lng': lastPointCoordinates[0]
		});
	};

	/** 
	 * Returns a marker with the coordinates and the icon for the trek given in parameter
	 *
	 * @param {object} trek
	 */
	this.getMarkerFromTrek = function (trek) {
		var coord;
		var marker;

		coord = self.getStartPoint(trek);
		marker = L.marker([coord.lat, coord.lng], { icon: IconsService.getDepartureIcon() });
		return (marker);
	};

	/** 
	 * Returns a marker with the coordinates and the icon for the poi given in parameter
	 *
	 * @param {object} poi
	 */
	this.getMarkerFromPoi = function (poi) {
		var coord;
		var marker;

		coord = self.getStartPoint(poi);
		marker = L.marker([coord.lat, coord.lng], { icon: IconsService.getPoiIcon(poi) });
		return (marker);
	};

	/** 
	 * Downloads a file
	 *
	 * @param {string} url - URL of the file to download
	 * @param {string} filepath - path where to save the file
	 * @param {string} fileName - name under which to save the file
	 * @param {string} forceDownload - downloads even if the file is already there
	 */
	this.downloadFile = function(url, filepath, fileName, forceDownload) {

		var deferred = $q.defer();
		var fileTransfer;
		var relativePath = filepath.replace(settings.cdvRoot + '/', '');

		if (angular.isUndefined(forceDownload)) {
			forceDownload = settings.forceDownload;
		}

		function onDownloadNeeded() {

			//console.log('Download starting');
			$cordovaFileTransfer.download(url, filepath + '/' + fileName)
			.then(function (success) {
				window.localStorage[filepath + fileName] = Date();
				deferred.resolve(constants.FILE_DOWNLOADED);
			},
			function (error) { deferred.reject(error); },
			function (progress) {
				deferred.notify(progress);
			});
		}

		if (forceDownload === false) {

			//console.log('Checking filesystem');
			$cordovaFile.checkFile(settings.cdvRoot + '/' + relativePath + '/', fileName)
			.then(function (success) {

				//console.log('File already there');

				// If the file is already on the device, we check if we need to update it
				var lastModifiedDate = new Date(window.localStorage[filepath + fileName]);
				var config = { headers: { 'If-Modified-Since': lastModifiedDate.toUTCString() }	};

				//console.log(url);
				$http.get(url, config)
				.then(function (success) {
					//console.log('Update needed');
					//console.log(filepath);

					// In case of answer 200, we remove the existing files, then download the file to update it
					$cordovaFile.removeFile(filepath + '/', fileName)
					.then(onDownloadNeeded, function (error) {
						deferred.reject(error);
					});
				},
				function (response) {
					//console.log('Update not needed');

					// In case of answer 304, the file is up to date, no need to download
					deferred.resolve(constants.FILE_ALREADY_THERE);
				});

			},
			// If the file is not on the device, we download it
			onDownloadNeeded);
		} else {

			onDownloadNeeded();
		}
		return (deferred.promise);
	};

	/** 
	 * Unzip a file
	 *
	 * @param {string} zipLocalPath - path of the zip file
	 * @param {string} toPath - path where to unzip the file
	 */
	this.unzip = function (zipLocalPath, toPath) {

		var deferred = $q.defer();

		// Calling unzip method from Zip Plugin (https://github.com/MobileChromeApps/zip)
		zip.unzip(zipLocalPath, toPath, function(result) {

			if (result == 0) {
				deferred.resolve("unzip complete");
			}
			else {
				deferred.reject("unzip failed");
			}
		}, function(eventProgress) {

			// eventProgress is a dict with 2 keys : loaded and total
			deferred.notify(eventProgress);
		});

		return (deferred.promise);
	};

	/** 
	 * Downloads and unzip a file
	 *
	 * @param {string} url - URL of the file to download
	 * @param {string} filepath - path where to save the file
	 * @param {string} fileName - name under which to save the file
	 * @param {string} forceDownload - downloads even if the file is already there
	 */
	this.downloadAndUnzip = function (url, filepath, fileName, forceDownload) {
		var deferred = $q.defer();

		function onUnzipNeeded() {

			//console.log('Unziping ' + filepath + '/' + fileName + ' to ' + filepath);
			self.unzip(filepath + '/' + fileName, filepath)
			.then(function (unzipRes) {	deferred.resolve('ok');	},
				function (error) { deferred.reject(error); });
		}

		function onDownloadSuccess(downloadRes) {

			if (downloadRes === constants.FILE_DOWNLOADED) {

				//console.log('Download success');
				onUnzipNeeded();
			}
			else {
				//console.log('Download not needed');
				deferred.resolve('ok');
			}
		}

		//console.log('Downloading: ' + url + ' to: ' + filepath + ' with filename: ' + fileName);
		self.downloadFile(url, filepath, fileName, forceDownload)
		.then(onDownloadSuccess, function (error) {
			deferred.reject(error);
		}, function (progress) {
			deferred.notify(progress);
		});

		return (deferred.promise);
	};
}

module.exports = {
	utils: utils
};