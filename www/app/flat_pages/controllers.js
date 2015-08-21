'use strict';

function flatPagesController($scope, flatPages) {

	$scope.flatPages = flatPages;
}

function flatPageController($scope, flatPage) {

	$scope.flatPage = flatPage;
}

module.exports = {
	flatPagesController: flatPagesController,
	flatPageController: flatPageController
};