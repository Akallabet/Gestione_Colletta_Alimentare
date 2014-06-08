'use strict';
var prodotti=[];

var SupermercatoCtrl= function($scope, $q, $resource, $location, $routeParams, GetInfoFactory, SupermercatoService, VersionService, ComuniService, CateneService, CapiEquipeService, CapiEquipeSupermercatiService, AreeService, SupermercatiService, dialogSupermercato)
{
	$scope.def= $q.defer();
	$scope.prom= $scope.def.promise;
	var tryPromises= [];
	$scope.version= VersionService.version;
	$scope.comuni= ComuniService.comuni;
	$scope.catene= CateneService.catene;
	$scope.aree= AreeService.aree;
	$scope.capi_equipe= CapiEquipeService.capi_equipe_array;
	$scope.capi_equipe_supermercati= CapiEquipeSupermercatiService.capi_equipe_supermercati;
	
	CateneService.getInfo();
	ComuniService.getInfo();
	AreeService.getInfo();
	CapiEquipeService.getInfo();
	CapiEquipeSupermercatiService.getInfo();
	
	$scope.modalTitle= dialogSupermercato.modalTitle;
	$scope.modalButtons= dialogSupermercato.modalButtons;
    $scope.newCapoEquipe= dialogSupermercato.newCapoEquipe;

	$scope.supermercato= SupermercatoService;
	$scope.supermercato.getInfo();

	// $scope.modifyCapoEquipeSupermercato= CapiEquipeService.actionInfo;

	$scope.editOrAddSupermercato= function()
	{
		var prom= null;
		if($scope.supermercato.info.id!=='' && $scope.supermercato.info.id!==null)
		{
			prom= $scope.supermercato.setInfo();
		}
		else
		{
			prom= $scope.supermercato.addInfo();
		}
		prom.then(function(){
			editOrAddCapoEquipeSupermercato();
		});
	}

	function editOrAddCapoEquipeSupermercato()
	{
		var prom= null;
    	var f= $scope.capi_equipe_supermercati.filter(function(c){ return c.id_supermercato===$scope.supermercato.info.id});
    	if(f.length>0)
    	{
    		if(f[0].id_capo_equipe!==$scope.supermercato.info.capo_equipe.id)
    		{
    			prom= CapiEquipeSupermercatiService.setInfo();
    		}
    		else
    		{
    			//$this.def.notify(1);
    			var d= $q.defer();
    			prom= d.promise;
    			d.resolve();
    		}
    	}
    	else
    	{
    		prom= CapiEquipeSupermercatiService.saveInfo();
    	}

    	prom.then(function(){
    		reinitializeObjects();
    	});
	}

	function reinitializeObjects()
	{
		$q.all([CapiEquipeService.getInfo(true),CapiEquipeSupermercatiService.getInfo(true)]).then(function(){
			SupermercatiService.getInfo(true);
		});
	}
}

SupermercatoCtrl.$inject= ['$scope', '$q', '$resource', '$location', '$routeParams', 'GetInfoFactory', 'SupermercatoService', 'VersionService','ComuniService','CateneService','CapiEquipeService', 'CapiEquipeSupermercatiService', 'AreeService', 'SupermercatiService', 'dialogSupermercato'];
