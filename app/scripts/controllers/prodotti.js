'use strict';
var prodotti=[];

var ProdottiCtrl=['$scope', '$resource', '$location', '$modal', '$routeParams', 'GetInfoFactory', 'ProductsFactory', 'ComuniService', 'CateneService', 'CapiEquipeService', 'CaricoService',
function($scope, $resource, $location, $modal, $routeParams, GetInfoFactory, ProductsFactory, ComuniService, CateneService, CapiEquipeService, CaricoService)
{
    $scope.supermercato= null;
    $scope.prodottiNomi= CaricoService.prodottiNomi;
    $scope.caricoTmpl= CaricoService.carico;

    $scope.prodottiCarichi={};
    $scope.prodottiLength=0;
    $scope.lastCarico=1;
    
    $scope.getSupermercatoById= function()
    {
        $scope.supermercato= $.parseJSON(localStorage.supermercato);
    }

    $scope.getCarichiByIdSupermercato= function()
    {
        var ret= new GetInfoFactory(
            {
                id_supermercato: $routeParams.idSupermercato
            }
        );
        
        ret.$save({
            token: $routeParams.token,
            property: 'prodotti'
        },
        function(){
            if(typeof ret.prodotti!='undefined')
            {
                $scope.prodotti= _.groupBy(ret.prodotti, function(prod){ return parseInt(prod.carico)});
                $scope.prodottiLength= Object.keys($scope.prodotti).length;
                CaricoService.lastId= ($scope.prodottiLength>0) ? Object.keys($scope.prodotti)[Object.keys($scope.prodotti).length-1] : 0;
            }
        });
    }
    
    $scope.$on("refresh", function(){
        $scope.getCarichiByIdSupermercato();
        $scope.getSupermercatoById();
    });

    $scope.$emit("refresh");
    
    $scope.isNaN= isNaN;
    $scope.parseInt= parseInt;

    $scope.open = function () {
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: CaricoCtrl,
            resolve: {
                
            }
        });

        modalInstance.result.then(function (selectedItem) {  
            newCarico();
        },function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    }

    function newCarico()
    {
        console.log($scope.caricoTmpl);
        /*
        var newCarico= new InsertInfoFactory({
            id_supermercato: $routeParams.idSupermercato,
            carico: $scope.lastCarico+1
        });
        var inewCarico= pr.$save({
            token: $routeParams.token
        },
        function(){
            //$scope.getCarichiByIdSupermercato();
        });*/
    }
}];