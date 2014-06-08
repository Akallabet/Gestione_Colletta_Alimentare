'use strict';
var prodotti=[];

var SupermercatoCtrl= function($scope, $resource, $location, $routeParams, GetInfoFactory, SupermercatoService, VersionService, ComuniService, CateneService, CapiEquipeService, CapiEquipeSupermercatiService, AreeService, dialogSupermercato)
{
	$scope.version= VersionService.version;
	$scope.comuni= ComuniService.comuni;
	$scope.catene= CateneService.catene;
	$scope.aree= AreeService.aree;
	$scope.capi_equipe= CapiEquipeService.capi_equipe_array;
	$scope.capi_equipe_supermercati= CapiEquipeService.capi_equipe_supermercati;
	
	CateneService.getInfo();
	ComuniService.getInfo();
	AreeService.getInfo();
	CapiEquipeService.getInfo();
	
	$scope.modalTitle= dialogSupermercato.modalTitle;
	$scope.modalButtons= dialogSupermercato.modalButtons;
    $scope.newCapoEquipe= dialogSupermercato.newCapoEquipe;

	$scope.supermercato= SupermercatoService;
	$scope.supermercato.getInfo();

	$scope.mod= SupermercatoService.mod;

	$scope.supermercato.prom.then(function(){

	},function()
	{

	},function(res)
	{
		console.log(res);
		// getSupermercati(true);
	});
}

SupermercatoCtrl.$inject= ['$scope', '$resource', '$location', '$routeParams', 'GetInfoFactory', 'SupermercatoService', 'VersionService','ComuniService','CateneService','CapiEquipeService', 'CapiEquipeSupermercatiService', 'AreeService', 'dialogSupermercato'];
