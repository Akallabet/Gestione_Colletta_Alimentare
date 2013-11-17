'use strict';
var prodotti=[];

var CaricoCtrl= function($scope, $resource, $location, $routeParams, GetInfoFactory, CaricoService, $modalInstance, VersionService)
{
	$scope.version= VersionService.version;
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
};

CaricoCtrl.$inject= ['$scope', '$resource', '$location', '$routeParams', 'GetInfoFactory', 'CaricoService', '$modalInstance', 'VersionService'];