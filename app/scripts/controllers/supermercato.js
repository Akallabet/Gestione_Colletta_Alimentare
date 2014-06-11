'use strict';
var prodotti=[];
collettaApp.controller('SupermercatoCtrl', ['$scope', '$q', '$resource', '$location', '$routeParams', 'GetInfoFactory', 'SupermercatoService', 'VersionService','ComuniService','CateneService','CapiEquipeService', 'CapiEquipeSupermercatiService', 'AreeService', 'SupermercatiService', 'dialogSupermercato', 'UserInfoService', 'FeedbackService',
function($scope, $q, $resource, $location, $routeParams, GetInfoFactory, SupermercatoService, VersionService, ComuniService, CateneService, CapiEquipeService, CapiEquipeSupermercatiService, AreeService, SupermercatiService, dialogSupermercato, UserInfoService, FeedbackService)
{
	$scope.generalFeedback= FeedbackService.feedback();
	$scope.generalFeedback.status= 0;

	$scope.feedback= FeedbackService.feedback();
	$scope.feedback.status= 0;
	
	$scope.def= $q.defer();
	$scope.prom= $scope.def.promise;
	var tryPromises= [];
	$scope.version= VersionService.version;
	$scope.user= UserInfoService.info;
	$scope.comuni= ComuniService.comuni;
	$scope.catene= CateneService.catene;
	$scope.aree= AreeService.aree;
	$scope.capi_equipe= CapiEquipeService.capi_equipe_array;
	$scope.capi_equipe_supermercati= CapiEquipeSupermercatiService.capi_equipe_supermercati;
	
	$scope.generalFeedback.changeStatus(1);
	$q.all([CateneService.getInfo(),
		ComuniService.getInfo(),
		AreeService.getInfo(),
		CapiEquipeService.getInfo(),
		CapiEquipeSupermercatiService.getInfo()
		]).then(function(){
			$scope.generalFeedback.changeStatus(2);
		},function(){
			$scope.generalFeedback.changeStatus(3);
		});
	
	$scope.modalTitle= dialogSupermercato.modalTitle;
	$scope.modalButtons= dialogSupermercato.modalButtons;
    $scope.newCapoEquipe= dialogSupermercato.newCapoEquipe;

	$scope.supermercato= SupermercatoService;
	$scope.supermercato.getInfo();

	// $scope.modifyCapoEquipeSupermercato= CapiEquipeService.actionInfo;

	$scope.editOrAddSupermercato= function()
	{
		var prom= null;
		$scope.feedback.changeStatus(1);
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
		},
		function(){
			$scope.feedback.changeStatus(3);
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
    	else if($scope.supermercato.info.capo_equipe.id!='')
    	{
    		prom= CapiEquipeSupermercatiService.saveInfo();
    	}
    	else
    	{
    		var d= $q.defer();
    		prom= d.promise;
    		d.resolve();
    	}

    	prom.then(function(){
    		$scope.feedback.changeStatus(2);
    		reinitializeObjects();
    	},
    	function(){
    		$scope.feedback.changeStatus(3);
    	});
	}

	function reinitializeObjects()
	{
		$q.all([CapiEquipeService.getInfo(true),CapiEquipeSupermercatiService.getInfo(true)]).then(function(){
			SupermercatiService.getInfo(true);
		});
	}
}]);