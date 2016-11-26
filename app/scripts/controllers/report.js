'use strict';
var catene=[];
collettaApp.controller('ReportCtrl',['$scope', '$q', '$resource', '$location', '$routeParams', 'GetInfoFactory', 'SetInfoFactory', 'UserInfoService', 'SupermercatiService', 'ComuniService', 'CateneService', 'CapiEquipeService', 'CaricoService', 'VersionService', 'CollettaService', 'SupermercatoService', 'InsertInfoFactory', 'ProvincieService', 'ReportService', 'FeedbackService',
function($scope, $q, $resource, $location, $routeParams, GetInfoFactory, SetInfoFactory, UserInfoService, SupermercatiService, ComuniService, CateneService, CapiEquipeService, CaricoService, VersionService, CollettaService, SupermercatoService, InsertInfoFactory, ProvincieService, ReportService, FeedbackService)
{
    $scope.Math=Math
    $scope.feedback= FeedbackService.feedback();
    $scope.excelMode= false;
    $scope.route= $routeParams;
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

    $scope.totaliComplessivi= ReportService.totaliComplessivi;
    $scope.prodotti= [];
    $scope.prodottiByTipo= [];
    $scope.prodottiByTipoTotal= [];
    $scope.Total= {kg: 0, scatole: 0};
    $scope.prodottiCarichi={};
    $scope.prodottiNomiDouble = []
    $scope.prodottiNomi= CaricoService.prodottiNomi;

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

    $scope.getSupermercati= function()
    {
        $scope.feedback.changeStatus(1);
        var query= {};
        if($scope.search.comune!=null && $scope.search.comune!='')
        {
            query.id_comune= $scope.search.comune;
        }
        else if($scope.search.provincia!=null && $scope.search.provincia!='')
        {
            query.id_provincia= $scope.search.provincia;
        }
        //if($scope.search.colletta!=null && $scope.search.colletta!='')
        //{
            query.id_colletta= $scope.search.colletta;
        //}
        CaricoService.getInfo($scope.search.colletta)
        .then(
      		function(){
            console.log($scope.prodottiTipi);
            $scope.prodottiNomiDouble.length = 0;
            for(var i=1; i<=($scope.prodottiNomi.length+1)*2;i++) {
              $scope.prodottiNomiDouble.push(i)
            }
            $scope.tipiTotali= {};
            for (var i in $scope.prodottiNomi) {
                $scope.tipiTotali[$scope.prodottiNomi[i].tipo]= {tipo: $scope.prodottiNomi[i].tipo, kg: 0, scatole: 0};
            };

            $scope.report.length=0;
            $scope.reportByComuni= ReportService.reportByComuni = {};
            $scope.reportByComuniArray.length=0;
            $scope.totaliComplessivi.tipiArray= [];
            $scope.totaliComplessivi.tipi= CaricoService.prodottiTmpl.map(function(p){return p;});
            $scope.totaliComplessivi.complessivo= {kg: 0, scatole: 0};
            getReport(query)
      		},
      		function(){
      				$scope.feedback.changeStatus(3);
      		}
      	);

        function getOrdineFromTipo(tipo) {
          return parseInt(CaricoService.prodottiNomiWithOrder.filter(function(p){ return p.nome === tipo;})[0].ordine)
        }

        function getReport(query){
          var superm= new GetInfoFactory(
              query
          );

          superm.$save({
              token: $routeParams.token,
                  property: 'report'
              },
              function(){
                $scope.supermercatiWithProducts = superm.report.filter(function(supermercato){
                  return supermercato.prodotti.length > 0 && supermercato.prodotti.reduce(function(a, b){
                    return a + parseInt(b.Kg)
                  }, 0) > 0
                }).map(function(report){
                  report.prodotti.sort(function(a,b){
                    return getOrdineFromTipo(a.prodotto) - getOrdineFromTipo(b.prodotto);
                  })
                  report.prodotti.forEach(function(prodotto){
                    prodotto.Kg = parseInt(prodotto.Kg)
                    prodotto.scatole = parseInt(prodotto.scatole)
                  })
                  return report
                })

                $scope.supermercatiTot = $scope.supermercatiWithProducts.map(function(supermercato){
                  return {
                    nome: supermercato.nome,
                    comune: $scope.comuni.filter(function(c){ return c.id === supermercato.id_comune;}).map(function(c){return c.nome;})[0],
                    catena: $scope.catene.filter(function(c){ return c.id === supermercato.id_catena})[0],
                    indirizzo: supermercato.indirizzo,
                    prodotti: supermercato.prodotti,
                    totali: supermercato.prodotti.reduce(function(a, b){
                      return {
                        Kg: a.Kg + b.Kg,
                        scatole: a.scatole + b.scatole
                      }
                    }, {
                      Kg: 0,
                      scatole: 0
                    }),
                    enabled: true
                  }
                })

                $scope.supermercatiWithProducts.forEach(function(supermercato){
                  var comuneFound = $scope.reportByComuniArray.filter(function(c){ return c.id_comune === supermercato.id_comune;})[0]
                  if(!comuneFound) {
                    $scope.reportByComuniArray.push(
                      $scope.comuni.filter(function(c){
                        return c.id === supermercato.id_comune;
                      })
                      .map(function(c){
                        return {
                          id_comune: c.id,
                          nome: c.nome,
                          totali: $.extend(true, [], CaricoService.prodottiTmpl),
                          complessivo: {
                            kg: 0,
                            scatole: 0
                          },
                          enabled: true
                        }
                      })[0]
                    )
                  }
                  comuneFound = $scope.reportByComuniArray.filter(function(c){ return c.id_comune === supermercato.id_comune;})[0]
                  supermercato.prodotti.forEach(function(prod, i){
                    comuneFound.totali[i].kg += prod.Kg
                    comuneFound.totali[i].scatole += prod.scatole
                    comuneFound.complessivo.kg += prod.Kg
                    comuneFound.complessivo.scatole += prod.scatole
                  })
                })

                $scope.supermercatiWithProducts.forEach(function(supermercato){
                  supermercato.prodotti.forEach(function(prod, i){
                    $scope.totaliComplessivi.tipi[i].kg += prod.Kg
                    $scope.totaliComplessivi.tipi[i].scatole += prod.scatole
                    $scope.totaliComplessivi.complessivo.kg += prod.Kg
                    $scope.totaliComplessivi.complessivo.scatole += prod.scatole
                  })
                })
                $scope.search.visible= false;
                $scope.feedback.changeStatus(2);
              },
              function()
              {
                  $scope.feedback.changeStatus(3);
              }
          );
        }
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
