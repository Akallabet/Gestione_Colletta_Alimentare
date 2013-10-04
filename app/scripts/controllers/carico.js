'use strict';
var prodotti=[];

var CaricoCtrl=['$scope', '$resource', '$location', '$routeParams', 'GetInfoFactory', 'CaricoService', 'ProductsFactory', 'InsertInfoFactory', '$modalInstance',
function($scope, $resource, $location, $routeParams, GetInfoFactory, CaricoService, ProductsFactory, InsertInfoFactory, $modalInstance)
{
	$scope.columns= CaricoService.prodottiNomi;
	$scope.carico = CaricoService.carico;
	$scope.lastId = CaricoService.lastId;
	
	$scope.ok = function () {
		$modalInstance.close();
		//newCarico();
		//console.log($scope.carico);
	}

	$scope.cancel = function () {
  		$modalInstance.dismiss('cancel');
	}
}];