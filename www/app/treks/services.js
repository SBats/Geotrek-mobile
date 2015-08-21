'use strict';

function TreksRemoteService($q) {
	var self = this;

	/**
	 * Downloads the specific files of the trek given in parameter
	 */
	this.downloadTrek = function (treks, trekId) {

		var deferred = $q.defer();
		var downloads = JSON.parse(window.localStorage.downloads);

		downloads[trekId] = true;
		treks[trekId].isDownloaded = true;
		angular.forEach(treks[trekId].properties.children, function (child) {
			downloads[child] = true;
			treks[child].isDownloaded = true;
		});
		window.localStorage.downloads = JSON.stringify(downloads);
		deferred.resolve('ok');
		return (deferred.promise);
	};

	/**
	 * Deletes the specific files of the trek given in parameter
	 */
	this.deleteTrek = function (treks, trekId) {

		var deferred = $q.defer();
		var downloads = JSON.parse(window.localStorage.downloads);

		downloads[trekId] = false;
		treks[trekId].isDownloaded = false;
		angular.forEach(treks[trekId].properties.children, function (child) {
			downloads[child] = false;
			treks[child].isDownloaded = false;
		});
		window.localStorage.downloads = JSON.stringify(downloads);
		deferred.resolve('ok');
		return (deferred.promise);
	};

	/**
	 * Resolves wether or not a trek is downloaded
	 */
	this.isTrekDownloaded = function (trekId) {
		var deferred = $q.defer();

		var downloads = JSON.parse(window.localStorage.downloads);
		if (downloads[trekId]) {
			deferred.resolve(true);
		}
		else {
			deferred.resolve(false);
		}

		return (deferred.promise);
	};
}

function TreksFileSystemService($q, $cordovaFile, utils, settings) {
	var self = this;

	/*
	 * Recursively downloads the trek's children
	 *
	 *  @param {object} trek - The trek for which to download the children
	 *  @param {number} currentChild - The child to download on this loop
	 *  @param {object} deferred -
	 *  @param {number} currentDl - The current number dl, used for the downloading bar
	 */
	function downloadChildren(treks, trek, currentChild, deferred, currentDl) {
		var childId = trek.properties.children[currentChild];

		if (angular.isUndefined(trek.properties.children) || currentChild >= trek.properties.children.length) {
			deferred.resolve('ok');
			return ;
		}

		utils.downloadAndUnzip(settings.trekZipUrl + childId + '.zip', settings.treksDir + '/' + childId, childId + '.zip')
		.then(function (downloadRes) {

			currentDl++;
			utils.downloadAndUnzip(settings.tilesZipUrl + childId + '.zip', settings.tilesDir + '/' + childId, childId + '.zip')
			.then(function (success) {

				treks[childId].isDownloaded = true;
				downloadChildren(treks, trek, currentChild + 1, deferred, currentDl + 1);
			}, function (error) {
				downloadChildren(treks, trek, currentChild + 1, deferred, currentDl + 1);
			}, function (progress) {
				deferred.notify({ current: currentDl, progress: (progress.loaded / progress.total) * 100 });
			});

		}, function (error) {
			downloadChildren(treks, trek, currentChild + 1, deferred, currentDl + 2);
		}, function (progress) {
			deferred.notify({ current: currentDl, progress: (progress.loaded / progress.total) * 100 });
		});
	}

	/**
	 * Downloads the specific files of the trek given in parameter
	 */
	this.downloadTrek = function (treks, trekId) {

		var deferred = $q.defer();
		var currentDl = 0;

		utils.downloadAndUnzip(settings.trekZipUrl + trekId + '.zip', settings.treksDir + '/' + trekId, trekId + '.zip')
		.then(function (downloadRes) {

			currentDl++;
			utils.downloadAndUnzip(settings.tilesZipUrl + trekId + '.zip', settings.tilesDir + '/' + trekId, trekId + '.zip')
			.then(function (success) {

				treks[trekId].isDownloaded = true;
				downloadChildren(treks, treks[trekId], 0, deferred, currentDl + 1);
			}, function (error) {
				deferred.reject(error);
			}, function (progress) {
				deferred.notify({ current: currentDl, progress: (progress.loaded / progress.total) * 100 });
			});

		}, function (error) {
			deferred.reject(error);
		}, function (progress) {
			deferred.notify({ current: currentDl, progress: (progress.loaded / progress.total) * 100 });
		});
		return (deferred.promise);
	};

	/*
	 * Recursively deletes the trek's children
	 *
	 *  @param {object} trek - The trek for which to delete the children
	 *  @param {number} currentChild - The child to delete on this loop
	 *  @param {object} deferred -
	 */
	function deleteChildren(treks, trek, currentChild, deferred) {
		var childId = trek.properties.children[currentChild];

		if (angular.isUndefined(trek.properties.children) || currentChild >= trek.properties.children.length) {
			deferred.resolve('ok');
			return ;
		}

		$cordovaFile.removeRecursively(settings.treksDir, String(childId))
		.then(function (success) {

			$cordovaFile.removeRecursively(settings.tilesDir, String(childId))
			.then(function (success) {

				treks[childId].isDownloaded = false;
				deleteChildren(treks, trek, currentChild + 1, deferred);
			}, function (error) {
				deleteChildren(treks, trek, currentChild + 1, deferred);
			});
		}, function (error) {
			deleteChildren(treks, trek, currentChild + 1, deferred);
		});
	}

	/**
	 * Deletes the specific files of the trek given in parameter
	 */
	this.deleteTrek = function (treks, trekId) {

		var deferred = $q.defer();

		$cordovaFile.removeRecursively(settings.treksDir, String(trekId))
		.then(function (success) {

			$cordovaFile.removeRecursively(settings.tilesDir, String(trekId))
			.then(function (success) {

				treks[trekId].isDownloaded = false;
				deleteChildren(treks, treks[trekId], 0, deferred);
			}, function (error) {
				deferred.reject(error);
			});
		}, function (error) {
			deferred.reject(error);
		});
		return (deferred.promise);
	};

	/**
	 * Resolves wether or not a trek is downloaded
	 */
	this.isTrekDownloaded = function (trekId) {
		var deferred = $q.defer();

		$cordovaFile.checkDir(settings.treksDir + '/' + String(trekId) + '/', 'media')
		.then(function (success) {
			deferred.resolve(true);
		}, function (error) {
			deferred.resolve(false);
		});

		return (deferred.promise);
	};
}

module.exports = {
	TreksRemoteService: TreksRemoteService,
	TreksFileSystemService: TreksFileSystemService
};