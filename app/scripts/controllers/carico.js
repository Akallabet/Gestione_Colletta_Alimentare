'use strict';
var prodotti=[];

var CaricoCtrl= function($scope, $resource, $location, $routeParams, GetInfoFactory, CaricoService, $modalInstance, VersionService, ProdottiService)
{
	$scope.version= VersionService.version;
	$scope.prodotti= ProdottiService.prodotti;
	$scope.columns= CaricoService.prodottiNomi;
	$scope.modifyId= CaricoService.modifyId;
	$scope.caricoTmpl= CaricoService.caricoTmpl
	$scope.carico = $scope.prodotti.filter(function(p){return p.id==$scope.modifyId;})[0];
	$scope.lastId = CaricoService.lastId;
	$scope.modalTitle= CaricoService.modalTitle;
	$scope.modalButtons= CaricoService.modalButtons;

	$scope.closeModal= function(action){
		$modalInstance.close(action);
	}
};

CaricoCtrl.$inject= ['$scope', '$resource', '$location', '$routeParams', 'GetInfoFactory', 'CaricoService', '$modalInstance', 'VersionService','ProdottiService'];