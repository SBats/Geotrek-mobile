'use strict';

function listDisplayController($rootScope, $scope, $state, $ionicPopup, $ionicHistory, $timeout, treks, TreksFactory, FiltersFactory) {

	$scope.treks = treks;

	$scope.downloadCallback = function (trekId) {
		TreksFactory.isTrekDownloaded(trekId).then(function (res) {
			if (res === true) {

				$ionicPopup.confirm({
					title: 'Téléchargement',
					template: 'Etes vous sur de vouloir supprimer cette rando ?'
				}).then(function (res) {

					if (res) {
						var myPopup = $ionicPopup.show({
							template: 'Suppression en cours',
							title: 'Supression',
							scope: $scope
						});
						TreksFactory.deleteTrek(trekId).then(function (res) {

							$timeout(function () {
								myPopup.close();
								$timeout(function () {
									$rootScope.$emit('treksChanged', {});
									$ionicPopup.alert({
										template: 'Randonnée supprimée'
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