'use strict';

function listDisplayController($rootScope, $scope, $state, $ionicPopup, treks, TreksService, FiltersFactory) {

	$scope.treks = treks;

	$scope.downloadCallback = function (trekId) {
		TreksService.isTrekDownloaded(trekId).then(function (res) {
			if (res === true) {

				$ionicPopup.confirm({
					title: 'Téléchargement',
					template: 'Etes vous sur de vouloir supprimer cette rando ?'
				}).then(function (res) {

					if (res) {						
						TreksService.deleteTrek(trekId).then(function (res) {

							$ionicPopup.alert({
								template: 'Randonnée supprimée'
							});
							document.getElementById('dl_' + trekId).style.color = '#333';
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
		TreksService.isTrekDownloaded(trekId).then(function (res) {
			if (res === true) {
				$state.go('root.detailed_trek', { trekId : trekId });
			}
			else {
				$state.go('root.trek_preview', { trekId : trekId });
			}
		});
	};

	$rootScope.$on('filtersChanged', function () {
		FiltersFactory.getFilteredTreks().then(function (treks) {
			$scope.treks = treks;
		});
	});
}

module.exports = {
	listDisplayController: listDisplayController
};