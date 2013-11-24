'use strict';
var prodotti=[];

collettaApp.controller('ProdottiCtrl', ['$scope', '$resource', '$location', '$modal', '$routeParams', 'GetInfoFactory', 'InsertInfoFactory', 'SetInfoFactory', 'DeleteInfoFactory', 'ComuniService', 'CateneService', 'CapiEquipeService', 'CaricoService', 'VersionService',
function($scope, $resource, $location, $modal, $routeParams, GetInfoFactory, InsertInfoFactory, SetInfoFactory, DeleteInfoFactory, ComuniService, CateneService, CapiEquipeService, CaricoService, VersionService)
{
    $scope.version= VersionService.version;
    $scope.view= 1;
    $scope.supermercato= null;
    $scope.prodottiNomi= CaricoService.prodottiNomi;
    $scope.caricoTmpl= CaricoService.caricoTmpl;
    $scope.prodotti=[];
    $scope.prodottiByTipo= [];
    $scope.prodottiByTipoTotal= [];
    $scope.Total= {kg: 0, scatole: 0};
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
                $scope.prodotti.length=0;

                var prodTmp= _.groupBy(ret.prodotti, function(prod){ return parseInt(prod.carico)});
                $scope.prodottiByTipo= _.groupBy(ret.prodotti, function(prod){ return prod.prodotto});
                
                var x=1;
                for(var i in prodTmp)
                {
                    $scope.prodotti.push({order: x, id: prodTmp[i][0].carico, objects: prodTmp[i]});
                    x++;
                }
                $scope.getProdottiByTipoTotal();
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
    
    $scope.getCaricoTotal= function(prods)
    {
        var ret= {kg: 0, scatole: 0};
        for(var i=0;i<prods.length;i++)
        {
            ret.kg+= parseFloat(prods[i].kg);
            ret.scatole+= parseFloat(prods[i].scatole);
        }
        return ret;
    }

    $scope.getProdottiByTipoTotal= function()
    {
        $scope.Total= {kg: 0, scatole: 0};
        $scope.prodottiByTipoTotal.length=0;
        var tmp= {type: '', kg: 0, scatole: 0};
        for(var i in $scope.prodottiByTipo)
        {
            var tmpRow= {type: i, kg: 0, scatole: 0};
            for(var j=0; j<$scope.prodottiByTipo[i].length; j++)
            {
                tmpRow.kg+= parseFloat($scope.prodottiByTipo[i][j].kg);
                tmpRow.scatole+= parseFloat($scope.prodottiByTipo[i][j].scatole);
            }
            $scope.Total.kg+= parseFloat(tmpRow.kg);
            $scope.Total.scatole+= parseFloat(tmpRow.scatole);
            $scope.prodottiByTipoTotal.push(tmpRow);
        }
    }

    $scope.openNewCarico = function () {
        CaricoService.modalTitle= "Nuovo Carico";
        CaricoService.modalButtons[0].active= true;
        CaricoService.modalButtons[1].active= false;
        CaricoService.modalButtons[2].active= true;

        $scope.caricoTmpl.map(function(c, i){return $.extend(c, CaricoService.newCarico[i])});
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: CaricoCtrl,
            resolve: {
                
            }
        });

        modalInstance.result.then(function (action,selectedItem) {
            if(action=='ok') saveNewCarico();
            else if(action=='dismiss')
            {

            }
        },function () {
            
            //$log.info('Modal dismissed at: ' + new Date());
        });
    }

    $scope.openSetCarico = function (carico) {
        CaricoService.modalTitle= "Modifica Carico";
        CaricoService.modalButtons[0].active= true;
        CaricoService.modalButtons[1].active= true;
        CaricoService.modalButtons[2].active= true;
        $scope.caricoTmpl.map(function(c, i){return $.extend(c, carico[i])});
        
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: CaricoCtrl,
            resolve: {
                
            }
        });

        modalInstance.result.then(function (action,selectedItem) {
            if(action=='ok') setCarico();
            else if(action=='del') removeCarico();
            else if(action=='dismiss')
            {

            }
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

    function removeCarico()
    {
        var values=[];
        var set=[];
        $scope.caricoTmpl.map(function(c){
            set.push({id: c.id});
        });
        
        var setC= new DeleteInfoFactory({
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
}]);