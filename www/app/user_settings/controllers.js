'use strict';

function userSettingsController($q, $state, $scope, $ionicPopup, $ionicHistory, $timeout, translations, constants, settings, utils, FiltersFactory, LanguageService, InitService, TreksFactory) {

	function clearAndReload() {
		$ionicHistory.clearCache();
		$ionicPopup.alert({
			template: translations['user_settings.lang_changed']
		}).then(function (res) {
			$state.go($state.current, {}, {reload: true});					
		});
	}

	LanguageService.getInterfaceLang().then(function (lang) {
		$scope.interfaceLang = lang;
	});
	$scope.changeInterfaceLang = function (lang) {
		$ionicPopup.confirm({
			title: translations['user_settings.change_lang'],
			template: translations['user_settings.confirm_change_lang_interface']
		}).then(function (res) {

			if (res) {						
				LanguageService.setInterfaceLang(lang);
				LanguageService.applyInterfaceLang();
				clearAndReload();
			}
		});
	};

	LanguageService.getTreksLang().then(function (lang) {
		$scope.treksLang = lang;
	});
	$scope.changeTreksLang = function (lang) {
		$ionicPopup.confirm({
			title: translations['user_settings.change_lang'],
			template: translations['user_settings.confirm_change_lang_data']
		}).then(function (res) {

			if (res) {
				LanguageService.setTreksLang(lang);
				LanguageService.applyTreksLang().then(function (res) {

					if (settings.isDevice) {
						utils.downloadAndUnzip(settings.globalTrekZipUrl, settings.treksDir + '/' + constants.GLOBAL_DIR, constants.GLOBAL_ZIP, true)
						.then(function (res) {
							
							FiltersFactory.getFilters(true).then(clearAndReload);

						}, function (error) {
							console.log('error');
						});
					}
					else {
						FiltersFactory.getFilters(true).then(clearAndReload);
					}	
				});
			}
		});
	};

	$scope.isConnected = settings.isConnected;

	$scope.syncMode = window.localStorage.syncMode;
	$scope.changeSyncMode = function (mode) {
		window.localStorage.syncMode = mode;
	};

	$scope.poiAlert = window.localStorage.alertOnPoi;
	$scope.changePoiAlert = function(value) {
		window.localStorage.alertOnPoi = value;
	};

	$scope.cleanData = function () {
		var promises = [];

		$ionicPopup.confirm({
			title: translations['user_settings.delete_data'],
			template: translations['user_settings.confirm_delete_data']
		}).then(function (res) {

			if (res) {
				var myPopup = $ionicPopup.show({
					title: translations['user_settings.deleting'],
					template: translations['user_settings.deleting_data'],
					scope: $scope
				});
				TreksFactory.getDownloadedTreks().then(function (treks) {
					angular.forEach(treks, function (trek) {
						if (!trek.properties.parent) {
							promises.push(TreksFactory.deleteTrek(trek.id));
						}
					});
					$q.all(promises).then(function (res) {
						$timeout(function () {
							myPopup.close();
							$timeout(function () {
								$ionicPopup.alert({
									template: translations['user_settings.data_deleted']
								});
							}, 200);
						}, 200);
					});
				});
			}
		});
	};
}

module.exports = {
	userSettingsController: userSettingsController
};