'use strict';
var prodotti=[];

var ProdottiCtrl=['$scope', '$resource', '$location', '$modal', '$routeParams', 'GetInfoFactory', 'InsertInfoFactory', 'SetInfoFactory', 'ComuniService', 'CateneService', 'CapiEquipeService', 'CaricoService', 'VersionService',
function($scope, $resource, $location, $modal, $routeParams, GetInfoFactory, InsertInfoFactory, SetInfoFactory, ComuniService, CateneService, CapiEquipeService, CaricoService, VersionService)
{
    $scope.version= VersionService.version;
    $scope.view= 1;
    $scope.supermercato= null;
    $scope.prodottiNomi= CaricoService.prodottiNomi;
    $scope.caricoTmpl= CaricoService.caricoTmpl;
    $scope.prodotti=[];
    $scope.prodottiByTipo= [];
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
                ret.prodotti.map(function(p){return $.extend(p, {carico: parseInt(p.carico), kg: parseInt(p.kg), scatole: parseInt(p.scatole)})});
                var prodTmp= _.groupBy(ret.prodotti, function(prod){ return parseInt(prod.carico)});
                $scope.prodottiByTipo= _.groupBy(ret.prodotti, function(prod){ return prod.prodotto});
                
                for(var i in prodTmp)
                {
                    $scope.prodotti.push({order: parseInt(i), objects: prodTmp[i]});
                }
                console.log($scope.prodotti);
                $scope.prodottiLength= $scope.prodotti.length;
                CaricoService.lastId= ($scope.prodottiLength>0) ? $scope.prodotti[$scope.prodotti.length-1].objects[0].carico : 0;
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

    $scope.openNewCarico = function () {
        CaricoService.modalTitle= "Nuovo Carico";
        $scope.caricoTmpl.map(function(c, i){return $.extend(c, CaricoService.newCarico[i])});
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: CaricoCtrl,
            resolve: {
                
            }
        });

        modalInstance.result.then(function (selectedItem) {
            saveNewCarico();
        },function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    }

    $scope.openSetCarico = function (carico) {
        CaricoService.modalTitle= "Modifica Carico";
        $scope.caricoTmpl.map(function(c, i){return $.extend(c, carico[i])});
        
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: CaricoCtrl,
            resolve: {
                
            }
        });

        modalInstance.result.then(function (selectedItem) {
            setCarico();
        },function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    }

    function saveNewCarico()
    {
        var tmpCarico= $scope.caricoTmpl.map(function(c){ 
            return $.extend({}, {
                id_supermercato: $routeParams.idSupermercato,
                id_user: '',
                prodotto:"'"+c.prodotto+"'",
                kg: c.kg,
                scatole: c.scatole,
                carico: parseInt(CaricoService.lastId)+1
            });
        });
        var newCarico= new InsertInfoFactory({
            values: tmpCarico
        });
        newCarico.$save({
            token: $routeParams.token,
            property: 'prodotti'
        },
        function(){
            $scope.$emit("refresh");
        });
    }

    function setCarico()
    {
        var values=[];
        var set=[];
        $scope.caricoTmpl.map(function(c){
                values.push(c);
                set.push({id: c.id});
        });
        
        var setC= new SetInfoFactory({
            values: values,
            set: set
        });
        setC.$save({
            token: $routeParams.token,
            property: 'prodotti'
        },
        function(){
            $scope.$emit("refresh");
        });
    }
}];