'use strict';

var geotrekMap = angular.module('geotrekMap');

geotrekMap.service('mapFileSystemService',
    ['$q', '$cordovaFile', 'logging', 'utils', 'settings',
    function ($q, $cordovaFile, logging, utils, settings) {

    this.getGlobalTileLayerURL = function() {
        return [
            settings.remote.LEAFLET_BACKGROUND_URL,
            settings.device.LEAFLET_BACKGROUND_URL
        ];
    };

    this.downloadGlobalBackground = function(url, progress) {
        return utils.downloadAndUnzip(url, settings.device.CDV_TILES_ROOT, false, progress);
    };

    this._deleteTiles = function(zoomLevel) {
        return utils.removeDir(settings.device.RELATIVE_TILES_ROOT + "/" + zoomLevel);
    };

    this.cleanDownloadedLayers = function() {
        var deferred = $q.defer(),
            promises = [],
            _this = this;

        $cordovaFile.listDir(settings.device.RELATIVE_TILES_ROOT)
        .then(function(listFiles) {
            var promises = [];

            angular.forEach(listFiles, function(mbtileFile) {
                // Remove the zip file
                if (mbtileFile.name.match(/\.zip$/i) && mbtileFile.name != settings.TILES_FILE_NAME) {
                    promises.push($cordovaFile.removeFile(settings.device.RELATIVE_TILES_ROOT + "/" + mbtileFile.name));
                }
            });

            // Remove the tiles foldes
            for (var i = 13; i <= 16; i++) {
                promises.push(_this._deleteTiles(i));
            }

            $q.all(promises)
            .then(
                function (layers) {
                    deferred.resolve(layers);
                }, function (err) {
                    console.error(err);
                    deferred.reject(err);
                }
            );

        }, function(error) {
            logging.error(error);
            deferred.resolve([]);
        });

        return deferred.promise;
    };

    this.downloadTrekPreciseBackground = function(trekId) {
        var url = settings.remote.TILES_REMOTE_PATH_URL + utils.getTrekFilename(trekId);
        return utils.downloadAndUnzip(url, settings.device.CDV_TILES_ROOT);
    };

    this.hasTrekPreciseBackground = function(trekId) {
        var deferred = $q.defer();

        var trekFilenamePath = settings.device.RELATIVE_TILES_ROOT + utils.getTrekFilename(trekId);
        $cordovaFile.checkFile(trekFilenamePath)
        .then(function(result) {
            deferred.resolve(true);
        }, function(error) {
            deferred.resolve(false);
        });

        return deferred.promise;
    };

}]);
