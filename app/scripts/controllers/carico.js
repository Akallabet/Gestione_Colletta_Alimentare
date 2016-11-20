'use strict';
var prodotti=[];

var CaricoCtrl= function($scope, $resource, $location, $routeParams, GetInfoFactory, CollettaService, CaricoService, VersionService, ProdottiService)
{
	CollettaService.prom.then(function(){
		CaricoService.getInfo()
		CaricoService.prom.then(
			function(){
				$scope.version= VersionService.version;
				$scope.prodotti= ProdottiService.prodotti;
				$scope.columns= CaricoService.prodottiNomi;
				$scope.modifyId= CaricoService.modifyId;
				$scope.caricoTmpl= CaricoService.caricoTmpl
				$scope.carico = $scope.prodotti.filter(function(p){return p.id==$scope.modifyId;})[0];
				$scope.lastId = CaricoService.lastId;

				$scope.closeModal= function(){}
			},
			function(){
					$scope.feedback.changeStatus(3);
			}
		);
	});
};

CaricoCtrl.$inject= ['$scope', '$resource', '$location', '$routeParams', 'GetInfoFactory', 'CollettaService', 'CaricoService', 'VersionService','ProdottiService'];
