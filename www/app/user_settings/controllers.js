'use strict';

function userSettingsController($state, $scope, $ionicPopup, $ionicHistory, constants, settings, utils, FiltersFactory, LanguageService, InitService, TreksService) {

	function clearAndReload() {
		$ionicHistory.clearCache();
		$ionicPopup.alert({
			template: 'Langue changée'
		}).then(function (res) {
			$state.go($state.current, {}, {reload: true});					
		});
	}

	LanguageService.getInterfaceLang().then(function (lang) {
		$scope.interfaceLang = lang;
	});
	$scope.changeInterfaceLang = function (lang) {
		$ionicPopup.confirm({
			title: 'Changement de langue',
			template: 'Etes vous sur de vouloir changer la langue de l\'interface ?'
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
			title: 'Changement de langue',
			template: 'Etes vous sur de vouloir changer la langue des données ?'
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

	$scope.cleanData = function () {
		var promises = [];

		$ionicPopup.confirm({
			title: 'Supprimer les données',
			template: 'Etes vous sur de vouloir supprimer les données téléchargées ?'
		}).then(function (res) {

			if (res) {						
				TreksService.getDownloadedTreks().then(function (res) {
					angular.forEach(treks, function (trek) {
						promises.push(TreksService.deleteTrek(trek.id));
					});
					$q.all(promises).then(function (res) {
						$ionicPopup.alert({
							template: 'Langue changée'
						})
					});
				});
			}
		});
	};
}

module.exports = {
	userSettingsController: userSettingsController
};