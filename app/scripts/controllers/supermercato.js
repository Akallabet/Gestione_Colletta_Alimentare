'use strict';
var prodotti=[];

var SupermercatoCtrl= function($scope, $resource, $location, $routeParams, GetInfoFactory, SupermercatoService, VersionService, ComuniService, CateneService, CapiEquipeService, AreeService, dialogSupermercato)
{
	$scope.version= VersionService.version;
	$scope.comuni= ComuniService.comuni;
	$scope.catene= CateneService.catene;
	$scope.aree= AreeService.aree;
	$scope.capi_equipe= CapiEquipeService.capi_equipe_array;
	
	$scope.modalTitle= dialogSupermercato.modalTitle;
	$scope.modalButtons= dialogSupermercato.modalButtons;
    $scope.newCapoEquipe= dialogSupermercato.newCapoEquipe;

	$scope.supermercato= SupermercatoService;

	$scope.mod= SupermercatoService.mod;
}

SupermercatoCtrl.$inject= ['$scope', '$resource', '$location', '$routeParams', 'GetInfoFactory', 'SupermercatoService', 'VersionService','ComuniService','CateneService','CapiEquipeService','AreeService', 'dialogSupermercato'];
