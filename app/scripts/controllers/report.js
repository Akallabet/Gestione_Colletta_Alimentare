'use strict';
var catene=[];
collettaApp.controller('ReportCtrl',['$scope', '$q', '$resource', '$location', '$routeParams', '$modal', 'GetInfoFactory', 'SetInfoFactory', 'SupermercatiService', 'ComuniService', 'CateneService', 'CapiEquipeService','AdminPagesService', 'CaricoService', 'VersionService', 'CollettaService', 'SupermercatoService', 'InsertInfoFactory', 'ProvincieService',
function($scope, $q, $resource, $location, $routeParams, $modal, GetInfoFactory, SetInfoFactory, SupermercatiService, ComuniService, CateneService, CapiEquipeService, AdminPagesService, CaricoService, VersionService, CollettaService, SupermercatoService, InsertInfoFactory, ProvincieService)
{
    AdminPagesService.section='report';
    $scope.version= VersionService.version;
    //$scope.report= SupermercatiService.supermercati=[];
    $scope.report={};
    $scope.reportByComuni={};
    $scope.reportByComuniArray= [];
    $scope.reportByProvincie={};
    $scope.newSupermercati= SupermercatiService.tmpl;
    $scope.colletta= CollettaService.colletta;
    $scope.collettaPromise= CollettaService.collettaPromise;
    $scope.searchForm= 1;
    $scope.checkedAll= 0;
    $scope.columns=[];
    $scope.getComuneById= getComuneById;
    $scope.provincie= ProvincieService.provincie;
    $scope.comuni= ComuniService.comuni;
    $scope.catene= CateneService.catene;
    $scope.supTmpl= SupermercatoService.tmpl;
    $scope.prodottiNomi= CaricoService.prodottiNomi;
    $scope.tipiTotali= {};
    for (var i in $scope.prodottiNomi) {
        $scope.tipiTotali[$scope.prodottiNomi[i].tipo]= {tipo: $scope.prodottiNomi[i].tipo, kg: 0, scatole: 0};
    };
    $scope.totaliComplessivi= {tipiArray: [], tipi: $.extend(true, {}, $scope.tipiTotali), complessivo: {kg: 0, scatole: 0, carichi: 0}};
    $scope.prodotti= [];
    $scope.prodottiByTipo= [];
    $scope.prodottiByTipoTotal= [];
    $scope.Total= {kg: 0, scatole: 0};
    $scope.prodottiCarichi={};

    $scope.pagination={
        page:1,
        itemsPerPage:50,
        currentPage: function()
        {
            return $scope.pagination.page*$scope.pagination.itemsPerPage;
        }
    }

    $scope.limitDecimal= function(num)
    {
        return (num % 1 === 0) ? num : num.toFixed(2);
    }

    $scope.parseInt= function(num)
    {
        return Math.round(num);
    }

    $scope.search={
        visible: true,
        provincia: '',
        comune: '',
        catena: '',
        comuniId: []
    }

    $scope.getComuni= function()
    {
        if($scope.comuni.length==0)
        {
            var comuniFactory= new GetInfoFactory();

            comuniFactory.$save({
                token: $routeParams.token,
                property: 'comuni'
            },
            function()
            {
                for (var i = 0; i < comuniFactory.comuni.length; i++) {
                    $scope.comuni.push(comuniFactory.comuni[i]);
                }
                var provincieTmp= _.uniq($scope.comuni.map(function(c){ return {id: c.id_provincia, nome: c.provincia}}), 'id');
                $scope.provincie.length=0;
                for (var i = 0; i < provincieTmp.length; i++) {
                    $scope.provincie[i]= $.extend({}, provincieTmp[i]);
                };
                ComuniService.def.resolve();
            });
        }
    }

    $scope.getCatene= function()
    {
        if($scope.catene.length==0)
        {
            var cateneFactory= new GetInfoFactory();
            cateneFactory.$save({
                token: $routeParams.token,
                property: 'catene'
            },function()
            {
                for (var i = 0; i < cateneFactory.catene.length; i++) {
                    $scope.catene.push(cateneFactory.catene[i]);
                }
                CateneService.def.resolve();
                catene= $scope.catene;
            });
        }
    }
    
    $scope.getSupermercati= function(id)
    {
        var query= {};
        if($scope.search.comune!=null && $scope.search.comune!='')
        {
            query.id_comune= $scope.search.comune;
        }
        else if($scope.search.provincia!=null && $scope.search.provincia!='')
        {
            query.id_provincia= $scope.search.provincia;
        }
        query.id_colletta= $scope.colletta.filter(function(c){return c.attiva==1})[0].id;
        
        var superm= new GetInfoFactory(
            query
        );
        
        superm.$save({
            token: $routeParams.token,
                property: 'report'
            },
            function(){
            //console.log($scope.reportByComuni)
            $scope.report={};
            $scope.reportByComuni= {};
            for(var i=0; i<superm.report.length;i++)
            {
                superm.report[i].catena= $scope.catene.filter(function(c){ return c.id==superm.report[i].id_catena})[0];
                $scope.report[superm.report[i].id]= superm.report[i];
                if(typeof $scope.reportByComuni[superm.report[i].id_comune]=='undefined')
                    $scope.reportByComuni[superm.report[i].id_comune]={nome: $scope.comuni.filter(function(c){return c.id==superm.report[i].id_comune})[0].nome, supermercati: [], prodotti:[], complessivo:{kg: 0, scatole: 0, carichi: []}, totali:{}, totaliArray:[], enabled: false};
                
                $scope.reportByComuni[superm.report[i].id_comune].supermercati.push($.extend({}, superm.report[i]));
            }

            $scope.getCarichiByIdSupermercati();
            $scope.search.visible= false;
        });
    }

    $scope.getCarichiByIdSupermercati= function()
    {
        var ret= new GetInfoFactory(
            {
                id_supermercato: {"IN": $scope.getAllSupermercatiIds()}
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
                $scope.reportByComuniArray.length=0;
                $scope.totaliComplessivi= {tipiArray: [], tipi: $.extend(true, {}, $scope.tipiTotali), complessivo: {kg: 0, scatole: 0, carichi: 0}};
                for (var i = 0; i < ret.prodotti.length; i++) {
                    $scope.reportByComuni[$scope.report[ret.prodotti[i].id_supermercato].id_comune].enabled= true;
                    $scope.reportByComuni[$scope.report[ret.prodotti[i].id_supermercato].id_comune].prodotti.push($.extend({}, ret.prodotti[i]));
                };

                for(var i in $scope.reportByComuni)
                {
                    $scope.reportByComuni[i].totali= $.extend(true,{}, $scope.tipiTotali);
                    for (var j = 0; j < $scope.reportByComuni[i].prodotti.length; j++) {
                        $scope.reportByComuni[i].totali[$scope.reportByComuni[i].prodotti[j].prodotto].kg+= parseFloat($scope.reportByComuni[i].prodotti[j].kg);
                        $scope.reportByComuni[i].totali[$scope.reportByComuni[i].prodotti[j].prodotto].scatole+= parseFloat($scope.reportByComuni[i].prodotti[j].scatole);
                        $scope.totaliComplessivi.tipi[$scope.reportByComuni[i].prodotti[j].prodotto].kg+= parseFloat($scope.reportByComuni[i].prodotti[j].kg);
                        $scope.totaliComplessivi.tipi[$scope.reportByComuni[i].prodotti[j].prodotto].scatole+= parseFloat($scope.reportByComuni[i].prodotti[j].scatole);
                        
                        $scope.reportByComuni[i].complessivo.kg+= parseFloat($scope.reportByComuni[i].prodotti[j].kg);
                        $scope.reportByComuni[i].complessivo.scatole+= parseFloat($scope.reportByComuni[i].prodotti[j].scatole);
                        $scope.totaliComplessivi.complessivo.kg+= parseFloat($scope.reportByComuni[i].prodotti[j].kg);
                        $scope.totaliComplessivi.complessivo.scatole+= parseFloat($scope.reportByComuni[i].prodotti[j].scatole);

                        if($scope.reportByComuni[i].complessivo.carichi.indexOf(parseInt($scope.reportByComuni[i].prodotti[j].id_supermercato))==-1)
                        {
                            $scope.reportByComuni[i].complessivo.carichi.push(parseInt($scope.reportByComuni[i].prodotti[j].id_supermercato));
                            $scope.totaliComplessivi.complessivo.carichi++;
                        }
                    }
                    for(var j in $scope.reportByComuni[i].totali)
                        $scope.reportByComuni[i].totaliArray.push($scope.reportByComuni[i].totali[j]);
                    
                    $scope.reportByComuniArray.push($scope.reportByComuni[i]);
                }
                for(var j in $scope.totaliComplessivi.tipi)
                    $scope.totaliComplessivi.tipiArray.push($scope.totaliComplessivi.tipi[j]);
            }
        });
    }

    $scope.getReport= function()
    {

    }

    function addInfoToSupermercati()
    {
        
    }

    $scope.$on("comuni", function()
    {
        $scope.getComuni();
    });
    $scope.$on("catene", function()
    {
        $scope.getCatene();
    });

    $q.all([$scope.collettaPromise,
            ComuniService.prom,
            CateneService.prom,
            ]).then(function(){
        //$scope.getSupermercati();
    });

    $scope.$emit("comuni");
    $scope.$emit("catene");

    
    $scope.getAllSupermercatiIds= function(property)
    {
        var ret=[];
        for(var i in $scope.report)
        {
            if(property!='undefined')
            {
                var match= true;
                for(var p in property)
                {
                    if($scope.report[i][p]!= property[p])
                    {
                        match= false;
                        break;
                    }
                }
                
                if(match)
                {
                    ret.push($scope.report[i].id);
                }
            }
            else
                ret.push($scope.report[i].id);
        }
        return ret;
    }

    $scope.filterFirst= {
        initSelection : function (element, callback) {
          callback($(element).data('$ngModelController').$modelValue);
        }
    }

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
}]);

collettaApp.filter('range', function() {
  return function(input, min, max) {
    var ret=[];
    if(typeof input!='undefined')
    {
        min = parseInt(min);
        max = parseInt(max);
        for (var i=min; i<max; i++)
        {
            if(i<input.length) ret.push(input[i]);
        }
    }
    return ret;
  };
});