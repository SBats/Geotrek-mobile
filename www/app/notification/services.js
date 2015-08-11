'use strict';

function notificationService(settings) {

	function deviceNotification(title, text, data) {
		cordova.plugins.notification.local.schedule({
			id: 1,
			title: title,
			text: text,
			data: data
		}, function (result) {
			console.log(result);
		});
	}

	function browserNotification(title, text, data) {
		console.log(title + ' | ' + text);
		console.log(data);
	}

	this.poiNotification = function (poi) {

		var title = poi.properties.name;
		var text = 'Vous êtes proche d\'un PdI !';
		var data = {};

		if (settings.isDevice) {
			deviceNotification(title, text, data);
		}
		else {
			browserNotification(title, text, data);
		}
	};
}

module.exports = {
	notificationService: notificationService
};