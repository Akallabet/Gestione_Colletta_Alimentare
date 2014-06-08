'use strict';
var catene=[];
collettaApp.controller('ReportCtrl',['$scope', '$q', '$resource', '$location', '$routeParams', '$modal', 'GetInfoFactory', 'SetInfoFactory', 'UserInfoService', 'SupermercatiService', 'ComuniService', 'CateneService', 'CapiEquipeService','AdminPagesService', 'CaricoService', 'VersionService', 'CollettaService', 'SupermercatoService', 'InsertInfoFactory', 'ProvincieService', 'ReportService',
function($scope, $q, $resource, $location, $routeParams, $modal, GetInfoFactory, SetInfoFactory, UserInfoService, SupermercatiService, ComuniService, CateneService, CapiEquipeService, AdminPagesService, CaricoService, VersionService, CollettaService, SupermercatoService, InsertInfoFactory, ProvincieService, ReportService)
{
    AdminPagesService.section='report';
    $scope.version= VersionService.version;
    $scope.tableView= false;
    $scope.report= ReportService.report;
    $scope.reportByComuni= ReportService.reportByComuni;
    $scope.reportByComuniArray= ReportService.reportByComuniArray;
    $scope.reportByProvincie={};
    $scope.newSupermercati= SupermercatiService.tmpl;
    $scope.colletta= CollettaService.colletta;
    $scope.user= UserInfoService.info;

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
    $scope.totaliComplessivi= ReportService.totaliComplessivi;
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
        //console.log(typeof num)
        if(typeof num !='undefined')
        {
            if(isNaN(num))
                num= parseFloat(num);
            return (num % 1 === 0) ? num : num.toFixed(2);
        }
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
        colletta: '',
        comuniId: []
    }

    CollettaService.prom.then(function(){
        $scope.search.colletta= CollettaService.active.id;
    });

    ComuniService.getInfo(false);
    CateneService.getInfo(false);
    
    $scope.getSupermercati= function(refresh)
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
        else if($scope.search.colletta!=null && $scope.search.colletta!='')
        {
            query.id_colletta= $scope.search.colletta;
        }
        
        var superm= new GetInfoFactory(
            query
        );
        
        $scope.report.length=0;
        $scope.reportByComuni= ReportService.reportByComuni = {};
        $scope.reportByComuniArray.length=0;
        $scope.totaliComplessivi.tipiArray= [];
        $scope.totaliComplessivi.tipi= $.extend(true, [], CaricoService.prodottiTmpl);
        $scope.totaliComplessivi.complessivo= {kg: 0, scatole: 0, carichi: 0};

        superm.$save({
            token: $routeParams.token,
                property: 'report'
            },
            function(){
                for(var i=0; i<superm.report.length;i++)
                {
                    superm.report[i].catena= $scope.catene.filter(function(c){ return c.id==superm.report[i].id_catena})[0];
                    //$scope.report[superm.report[i].id]= superm.report[i];
                    if(superm.report[i].prodotti.length>0) superm.report[i].enabled= true;
                    else superm.report[i].enabled= false;
                    if(typeof $scope.reportByComuni[superm.report[i].id_comune]=='undefined')
                    {
                        $scope.reportByComuni[superm.report[i].id_comune]={
                            nome: $scope.comuni.filter(function(c){return c.id==superm.report[i].id_comune})[0].nome,
                            objects: [],
                            complessivo:{kg: 0, scatole: 0, carichi: []},
                            totali: $.extend(true, [], CaricoService.prodottiTmpl),
                            enabled: false
                        }
                    }
                    var c_tmp= $scope.reportByComuni[superm.report[i].id_comune];
                    c_tmp.objects.push(superm.report[i]);
                    if(superm.report[i].prodotti.length>0) c_tmp.enabled= true;
                    var tipi_tmp= $.extend(true, {}, $scope.tipiTotali);
                    superm.report[i].totali={kg: 0, scatole: 0};
                    for (var j=0;j<superm.report[i].prodotti.length;j++)
                    {
                        superm.report[i].prodotti[j].Kg= parseInt(superm.report[i].prodotti[j].Kg);
                        superm.report[i].prodotti[j].scatole= parseInt(superm.report[i].prodotti[j].scatole);

                        var prod_tmp= c_tmp.totali.filter(function(t){return t.prodotto==superm.report[i].prodotti[j].prodotto})[0];
                        var tot_tmp= $scope.totaliComplessivi.tipi.filter(function(t){return t.prodotto==superm.report[i].prodotti[j].prodotto})[0];
                        
                        superm.report[i].totali.kg+= superm.report[i].prodotti[j].Kg;
                        superm.report[i].totali.scatole+= superm.report[i].prodotti[j].scatole;
                        prod_tmp.kg+= superm.report[i].prodotti[j].Kg;
                        prod_tmp.scatole+= superm.report[i].prodotti[j].scatole;
                        c_tmp.complessivo.kg+= superm.report[i].prodotti[j].Kg;
                        c_tmp.complessivo.scatole+= superm.report[i].prodotti[j].scatole;

                        tot_tmp.kg+= superm.report[i].prodotti[j].Kg;
                        tot_tmp.scatole+= superm.report[i].prodotti[j].scatole;
                        $scope.totaliComplessivi.complessivo.kg+= superm.report[i].prodotti[j].Kg;
                        $scope.totaliComplessivi.complessivo.scatole+= superm.report[i].prodotti[j].scatole;
                    }
                    superm.report[i].comune= c_tmp.nome;
                    superm.report[i].catena= $scope.catene.filter(function(c){ return c.id==superm.report[i].id_catena})[0];
                    $scope.report.push($.extend(true, {}, superm.report[i]))
                    // console.log(superm.report[i]);
                }
                for(var i in $scope.reportByComuni)
                {
                    $scope.reportByComuniArray.push($scope.reportByComuni[i]);
                }
                // console.log($scope.reportByComuniArray);
                $scope.search.visible= false;
            }
        );
    }
    
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
