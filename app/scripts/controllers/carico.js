'use strict';
var prodotti=[];

var CaricoCtrl=['$scope', '$resource', '$location', '$routeParams', 'GetInfoFactory', 'CaricoService', '$modalInstance',
function($scope, $resource, $location, $routeParams, GetInfoFactory, CaricoService, $modalInstance)
{
	$scope.columns= CaricoService.prodottiNomi;
	$scope.carico = CaricoService.caricoTmpl;
	$scope.lastId = CaricoService.lastId;
	$scope.modalTitle= CaricoService.modalTitle;

	$scope.ok = function () {
		$modalInstance.close();
	}

	$scope.cancel = function () {
  		$modalInstance.dismiss('cancel');
	}
}];