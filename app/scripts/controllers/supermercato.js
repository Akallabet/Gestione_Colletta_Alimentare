'use strict';
var prodotti=[];

var SupermercatoCtrl= function($scope, $resource, $location, $routeParams, GetInfoFactory, SupermercatoService, $modalInstance, VersionService, ComuniService, CateneService, CapiEquipeService, AreeService)
{
	$scope.version= VersionService.version;
	$scope.comuni= ComuniService.comuni;
	$scope.catene= CateneService.catene;
	$scope.aree= AreeService.aree;
	$scope.capi_equipe= CapiEquipeService.capi_equipe_array;
	
	$scope.modalTitle= SupermercatoService.modalTitle;
	$scope.modalButtons= SupermercatoService.modalButtons;

	$scope.supTmpl= SupermercatoService.tmpl;
	$scope.mod= SupermercatoService.mod;
	
	$scope.closeModal= function(action){
		$modalInstance.close(action);
	}
}

SupermercatoCtrl.$inject= ['$scope', '$resource', '$location', '$routeParams', 'GetInfoFactory', 'SupermercatoService', '$modalInstance', 'VersionService','ComuniService','CateneService','CapiEquipeService','AreeService'];