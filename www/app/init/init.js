'use strict';

function initService(settings, constants, utils) {

	this.getDeviceFiles = function () {
		// Downloads the .zip containing the main geojson and the tiles
		utils.downloadFile(settings.globalZipUrl, settings.globalZipLocation, constants.GLOBAL_ZIP);
	};
}

module.exports = {
	initService: initService
};