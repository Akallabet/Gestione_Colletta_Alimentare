'use strict';
var prodotti=[];

collettaApp.controller('ProdottiCtrl', ['$scope', '$resource', '$location', '$routeParams', 'GetInfoFactory', 'InsertInfoFactory', 'SetInfoFactory', 'DeleteInfoFactory', 'CollettaService', 'ComuniService', 'CateneService', 'CapiEquipeService', 'CaricoService', 'VersionService', 'ProdottiService', 'FeedbackService',
function($scope, $resource, $location, $routeParams, GetInfoFactory, InsertInfoFactory, SetInfoFactory, DeleteInfoFactory, CollettaService, ComuniService, CateneService, CapiEquipeService, CaricoService, VersionService, ProdottiService, FeedbackService)
{
  CollettaService.prom.then(function(){
    CaricoService.getInfo()
    CaricoService.prom.then(
  		function(){
  			$scope.prodottiNomi= CaricoService.prodottiNomi;
        $scope.caricoTmpl= CaricoService.caricoTmpl;
        $scope.modifyId= CaricoService.modifyId;
  		},
  		function(){
  				$scope.feedback.changeStatus(3);
  		}
  	);
  });
    $scope.version= VersionService.version;
    $scope.feedback= FeedbackService.feedback();
    $scope.feedback.status=0;

    $scope.feedbackDialog= FeedbackService.feedback();
    $scope.feedbackDialog.status=0;

    $scope.nuovoCarico= false;
    $scope.modificaCarico= false;

    $scope.supermercato= null;

    $scope.editCarico= {};

    $scope.prodotti= ProdottiService.prodotti;
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
        $scope.feedback.changeStatus(1);
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
                $scope.feedback.changeStatus(2);
                $scope.prodotti.length=0;

                var prodTmp= _.groupBy(ret.prodotti, function(prod){ return parseInt(prod.carico)});
                $scope.prodottiByTipo= _.groupBy(ret.prodotti, function(prod){ return prod.prodotto});

                var x=1;
                for(var i in prodTmp)
                {
                    $scope.prodotti.push($.extend({},{id: prodTmp[i][0].carico, objects: prodTmp[i]}));
                    x++;
                }
                $scope.getProdottiByTipoTotal();
                $scope.prodottiLength= $scope.prodotti.length;
                CaricoService.lastId= ($scope.prodottiLength>0) ? $scope.prodotti[$scope.prodotti.length-1].objects[0].carico : 0;
            }
            else
            {
                $scope.feedback.changeStatus(3);
            }
        },function(){
            $scope.feedback.changeStatus(3);
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
        $scope.caricoTmpl.map(function(c, i){return $.extend(c, CaricoService.newCarico[i])});
        $scope.nuovoCarico= true;
    }

    $scope.openSetCarico = function (carico) {
        $scope.editCarico= carico;
        $scope.modifyId= CaricoService.modifyId=carico.id;
        $scope.modifyId= carico.ordine;
        $scope.modificaCarico= true;
    }

    $scope.saveNewCarico= function()
    {
        $scope.feedback.changeStatus(1);
        var lastId= ($scope.prodotti.length>0) ? parseInt($scope.prodotti[$scope.prodotti.length-1].id) : 0;
        var tmpCarico= $scope.caricoTmpl.map(function(c){
            return $.extend({}, {
                id_supermercato: $routeParams.idSupermercato,
                id_user: '',
                prodotto: c.prodotto,
                kg: (c.kg!="") ? c.kg : 0,
                scatole: (c.scatole!="") ? c.scatole : 0,
                carico: lastId+1
            });
        });
        $scope.nuovoCarico= false;
        var newCarico= new InsertInfoFactory({
            values: tmpCarico,
            prodotti: CaricoService.prodottiNomi
        });
        newCarico.$save({
            token: $routeParams.token,
            property: 'prodotti'
        },
        function(){
            $scope.$emit("refresh");
            $scope.feedback.changeStatus(2);
            $scope.feedbackDialog.changeStatus(2);
        },
        function(){
            $scope.feedback.changeStatus(3);
        });
    }

    $scope.setCarico= function()
    {
        $scope.feedback.changeStatus(1);
        var values=[];
        var set=[];
        $scope.editCarico.objects.map(function(c){
                values.push(c);
                set.push({id: c.id});
        });
        $scope.modificaCarico= false;
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
            $scope.feedback.changeStatus(2);
            $scope.feedbackDialog.changeStatus(2);
        },
        function(){
            $scope.feedback.changeStatus(3);
        });
    }

    $scope.removeCarico= function()
    {
        $scope.feedback.changeStatus(1);
        var values=[];
        var set=[];
        var index;
        $scope.prodotti.map(function(p, i){if(p.id==$scope.editCarico.id) index=i;});
        $scope.editCarico.objects.map(function(c){
            set.push({id: c.id});
        });

        $scope.modificaCarico= false;
        $scope.prodotti.splice(index,1);

        var setC= new DeleteInfoFactory({
            values: values,
            set: set
        });
        setC.$save({
            token: $routeParams.token,
            property: 'prodotti'
        },
        function(){
            orderCarichi();
            $scope.feedback.changeStatus(2);
            $scope.feedbackDialog.changeStatus(2);
            //$scope.$emit("refresh");
        },
        function(){
            $scope.feedback.changeStatus(3);
        });
    }

    function orderCarichi()
    {
        var values=[];
        var set=[];
        for (var i = 0; i < $scope.prodotti.length; i++) {
            for (var j = 0; j < $scope.prodotti[i].objects.length; j++) {
                $scope.prodotti[i].objects[j].carico= i+1;
                values.push({carico: $scope.prodotti[i].objects[j].carico});
                set.push({id: $scope.prodotti[i].objects[j].id});
            };
        };

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
}]);
