'use strict';

function listDisplayController($rootScope, $scope, $state, $ionicPopup, $ionicHistory, $timeout, translations, treks, TreksFactory, FiltersFactory) {

	$scope.treks = treks;

	$scope.downloadCallback = function (trekId) {
		TreksFactory.isTrekDownloaded(trekId).then(function (res) {
			if (res === true) {

				$ionicPopup.confirm({
					title: translations['treks_list.delete'],
					template: translations['treks_list.confirm_delete']
				}).then(function (res) {

					if (res) {
						var myPopup = $ionicPopup.show({
							title: translations['treks_list.delete'],
							template: translations['treks_list.deleting'],
							scope: $scope
						});
						TreksFactory.deleteTrek(trekId).then(function (res) {

							$timeout(function () {
								myPopup.close();
								$timeout(function () {
									$rootScope.$emit('treksChanged', {});
									$ionicPopup.alert({
										template: translations['treks_list.trek_deleted']
									});
								}, 200);
							}, 200);
						});
					}
				});
			}
			else {
				$state.go('root.trek_preview', { trekId : trekId });
			}
		});
	};

	$scope.goToTrek = function (trekId) {
		TreksFactory.isTrekDownloaded(trekId).then(function (res) {
			if (res === true) {
				$state.go('root.detailed_trek', { trekId : trekId });
			}
			else {
				$state.go('root.trek_preview', { trekId : trekId });
			}
		});
	};

	function updateTreks() {
		$ionicHistory.clearCache();
	}

	$rootScope.$on('filtersChanged', function () {
		updateTreks();
	});
	$rootScope.$on('treksChanged', function () {
		updateTreks();
	});
}

module.exports = {
	listDisplayController: listDisplayController
};