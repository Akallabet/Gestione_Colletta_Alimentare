'use strict';
var prodotti=[];

var ProdottiCtrl=['$scope', '$resource', '$location', '$routeParams', 'GetInfoFactory', 'ProductsFactory',
function($scope, $resource, $location, $routeParams, GetInfoFactory, ProductsFactory)
{
    $scope.prodottiNomi=[
        {tipo:'OLIO'},
        {tipo:'OMOGENIZZATI'},
        {tipo:'ALIMENTI INFANZIA'},
        {tipo:'TONNO'},
        {tipo:'CARNE IN SCATOLA'},
        {tipo:'PELATI'},
        {tipo:'LEGUMI'},
        {tipo:'PASTA'},
        {tipo:'RISO'},
        {tipo:'ZUCCHERO'},
        {tipo:'LATTE'},
        {tipo:'VARIE'}
    ];
    
    $scope.prodottiCarichi={};
    $scope.prodottiLength=0;
    $scope.lastCarico=1;
    
    $scope.getCarichiByIdSupermercato= function()
    {
        var ret= GetInfoFactory.get({
            token: $routeParams.token,
            property: 'prodotti',
            method: 'IdSupermercato',
            par: $routeParams.idSupermercato,
        },
        function(){
            $scope.prodottiCarichi={};
            $scope.prodottiLength=0;
            for(var i in ret.prodotti)
            {
                if(typeof $scope.prodottiCarichi[parseInt(ret.prodotti[i].carico)]=='undefined')
                {
                    $scope.prodottiCarichi[parseInt(ret.prodotti[i].carico)]=[];
                    if(ret.prodotti[i].carico>=$scope.lastCarico) $scope.lastCarico= ret.prodotti[i].carico+1;
                }
                $scope.prodottiCarichi[parseInt(ret.prodotti[i].carico)].push(ret.prodotti[i]);
                $scope.prodottiLength++;
            }
            
            for(var i in $scope.prodottiCarichi)
            {
                for(var x in $scope.prodottiNomi)
                {
                    var found=false;
                    for(var j in $scope.prodottiCarichi[i])
                    {
                        if($scope.prodottiCarichi[i][j].prodotto==$scope.prodottiNomi[x].tipo)
                        {
                            found=true;
                            break;
                        }
                    }
                    if(!found)
                    {
                        $scope.prodottiCarichi[i].push({
                            carico: i,
                            id: null,
                            id_supermercato: $routeParams.idSupermercato,
                            id_user: null,
                            kg: 0,
                            prodotto: $scope.prodottiNomi[x].tipo,
                            scatole: 0,
                            ultima_modifica: ''
                        });
                    }
                }
            }
            prodotti= $scope.prodottiCarichi;
        });
    }
    
    $scope.getCarichiByIdSupermercato();
    
    $scope.newCarico= function()
    {
        var pr= new ProductsFactory({
            token: $routeParams.token,
            id_supermercato: $routeParams.idSupermercato,
            carico: $scope.lastCarico
        });
        var newCarico= pr.$save(function(){
            $scope.getCarichiByIdSupermercato();
        });
    }
    
    /*
    $scope.getCarichiByIdSupermercato= function()
    {
        var car= GetInfoService.get({
            token: $routeParams.token,
            property: 'carichi',
            method: 'IdSupermercato',
            par: $routeParams.idSupermercato,
        },
        function(){
            for(var i in car.carichi)
            {
                console.log(car.carichi[i]);
                //$scope.supermercati.push(angular.extend({index: i+1},superm.supermercati[i]));
            }
        });
    }
    $scope.getCarichiByIdSupermercato();*/
}];