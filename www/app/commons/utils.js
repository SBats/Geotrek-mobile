'use strict';

function utils($http, $translate, $ionicPopup, $q, $cordovaFile, $cordovaFileTransfer, settings, constants, IconsService) {

	var self = this;

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

      // Place each trek's departure marker on the map
      this.getMarkerFromTrek = function (trek) {
            var coord;
            var marker;

            coord = self.getStartPoint(trek);
            marker = L.marker([coord.lat, coord.lng], { icon: IconsService.getDepartureIcon() });
            return (marker);
      };

	this.createClusterMarkerFromTrek = function(trek) {
		var startPoint = self.getStartPoint(trek);

		var marker = L.marker([startPoint.lat, startPoint.lng], {
			icon: 'img/marker-source.png'
		});

		return (marker);
	};

	this.downloadFile = function(url, filepath, fileName, forceDownload) {

        if (angular.isUndefined(forceDownload)) {
            forceDownload = settings.forceDownload;
        }

        if (forceDownload === false) {

            var relativePath = filepath.replace(constants.CDV_ROOT + '/', '');

            $cordovaFile.checkFile(relativePath, fileName).then(function (succes) {
            	console.log('File already there');
            }, function (error) {
            	console.log('Need to download : ' + url);
            	var fileTransfer = new FileTransfer();
            	fileTransfer.download(
            		url, relativePath,
            		function (succes) {
            			console.log('File downloaded');
            		},
            		function (error) {
            			console.log(error);
            		});
            });

            // return ($cordovaFile.readFileMetadata(relativePath)
            // .then(function(file) {

            //     // If there is a file, we check on server if file was modified
            //     // by using HTTP header 'If-Modified-Since'
            //     var lastModifiedDate = new Date(file.lastModifiedDate),
            //         config = {
            //             headers: {
            //                 'If-Modified-Since': lastModifiedDate.toUTCString()
            //             }
            //         };

            //     // NOTICE
            //     // We have used $http service because we needed 'If-Modified-Since' HTTP header,
            //     // and cordova plugin file transfer (used by $cordovaFile.downloadFile) doesn't manage it properly.
            //     // In case on 304, response body is empty, and cordova plugin overwrites previous data with empty file...
            //     // https://issues.apache.org/jira/browse/CB-7006

            //     return $http.get(url, config)
            //     .then(function(response) {
            //         // Response is 2xx

            //         // It means that server file is more recent than device one
            //         // We download it so !
            //         // We could have used $cordovaFile 'writeFile' function, as response contains our data,
            //         // but we prefer 'downloadFile' call to be consistent with other cases.
            //         $translate([
            //             'maj_title',
            //             'maj_message'
            //         ]).then(function(translations) {
            //             var alertPopup = $ionicPopup.alert({
            //                 title: translations.maj_title,
            //                 template: translations.maj_message
            //             });
            //             alertPopup.then(function(res) {
            //                 console.log('User knows !');
            //             });
            //         });
            //         return $cordovaFile.downloadFile(url, filepath);

            //     }, function(response) {
            //         var status = response.status,
            //             deferred = $q.defer();

            //         if (status === 304) {
            //             // If status is 304, it means that server file is older than device one
            //             // Do nothing.
            //             var msg = 'File not changed (304) : ' + url + ' at ' + filepath;
            //             deferred.resolve({message: msg, type: 'connection', data: {status: status}});
            //         }
            //         else {
            //             // If status is different than 304, there is a connection problem

            //             // We can't connect to URL
            //             if (status === 0) {
            //                 deferred.reject({message: 'Network unreachable', type: 'connection', data: {status: status}});
            //             }
            //             else {
            //                 deferred.reject({message: 'Response error ', type: 'connection', data: {status: status}});
            //             }
            //         }
            //         return deferred.promise;
            //     });

            // }, function() {
            //     // If there is no file with that path, we download it !
            //     return ($cordovaFile.downloadFile(url, filepath));
            // }));
        } else {
            return ($cordovaFile.downloadFile(url, filepath));
        }
    };

}

module.exports = {
	utils: utils
};