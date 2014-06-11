'use strict';
var catene=[];
collettaApp.controller('SupermercatiCtrl',['$scope', '$q', '$resource', '$location', '$routeParams', 'GetInfoFactory', 'SetInfoFactory', 'SupermercatiService', 'ComuniService', 'CateneService', 'CapiEquipeService', 'CapiEquipeSupermercatiService', 'CaricoService', 'VersionService', 'CollettaService', 'SupermercatoService', 'dialogSupermercato','InsertInfoFactory', 'ProvincieService', 'AreeService', 'FilterService', 'UserInfoService', 'FeedbackService',
function($scope, $q, $resource, $location, $routeParams, GetInfoFactory, SetInfoFactory, SupermercatiService, ComuniService, CateneService, CapiEquipeService, CapiEquipeSupermercatiService, CaricoService, VersionService, CollettaService, SupermercatoService, dialogSupermercato, InsertInfoFactory, ProvincieService, AreeService, FilterService, UserInfoService, FeedbackService)
{
    $scope.feedback= FeedbackService.feedback();
    $scope.feedback.status=0;

    $scope.version= VersionService.version;
    $scope.initialized= false;
    $scope.supermercati= SupermercatiService.supermercati;
    $scope.newSupermercati= SupermercatiService.tmpl;

    $scope.checkedAll= 0;
    $scope.columns=[];
    $scope.getComuneById= getComuneById;
    $scope.chosenSuperm= 2;

    $scope.user= UserInfoService.info;
    $scope.colletta= CollettaService.colletta;
    $scope.provincie= ProvincieService.provincie;
    $scope.comuni= ComuniService.comuni;
    $scope.aree= AreeService.aree;
    $scope.catene= CateneService.catene;
    $scope.capi_equipe= CapiEquipeService.capi_equipe;
    $scope.capi_equipe_array= CapiEquipeService.capi_equipe_array;
    $scope.capi_equipe_supermercati= CapiEquipeSupermercatiService.capi_equipe_supermercati;
    $scope.newCapoEquipe= dialogSupermercato.newCapoEquipe;
    $scope.supermercato= SupermercatoService;

    $scope.pagination={
        page:1,
        itemsPerPage:50,
        currentPage: function()
        {
            return $scope.pagination.page*$scope.pagination.itemsPerPage;
        }
    }

    $scope.filter= FilterService.filter;
    
    $scope.feedback.changeStatus(1);
    ComuniService.getInfo();
    CateneService.getInfo();
    AreeService.getInfo();
    CapiEquipeService.getInfo();
    CapiEquipeSupermercatiService.getInfo();

    $scope.addCapoEquipe= function()
    {
        if($scope.newCapoEquipe.nome!='')
        {
            var newCapoEquipe= new InsertInfoFactory({
                values: [{nome: $scope.newCapoEquipe.nome, email: "", telefono:""}]
            });

            newCapoEquipe.$save({
                    token: $routeParams.token,
                    property: 'capi_equipe'
                },
                function(result)
                {
                    $scope.newCapoEquipe.status=0;
                    var ce= {id:result.capi_equipe.id,nome: $scope.newCapoEquipe.nome, email: "", telefono:""};
                    $scope.capi_equipe[result.capi_equipe.id]= ce;
                    $scope.capi_equipe_array.push(ce);
                }
            );
        }
        else
        {
            $scope.newCapoEquipe.status=0;
        }
    }

    $scope.setToggledSupermercati= function(bool)
    {
        //console.log($scope.getAllSupermercatiIds({checked: true}))
        var set= new SetInfoFactory({
            values: [{
                id_supermercato:{'IN' : $scope.getAllSupermercatiIds({checked: 1})}
            }],
            set:[{
                confermato: bool
            }]
        });
        
        set.$save({
            token: $routeParams.token,
            property: 'supermercati'
        },
        function()
        {

        });
    }

    $q.all([CapiEquipeService.prom,
            CapiEquipeSupermercatiService.prom,
            CollettaService.prom,
            ComuniService.prom,
            CateneService.prom
            ]).then(function(){
        $scope.initialized= true;
        
        SupermercatiService.getInfo(false).then(function(){
            $scope.feedback.changeStatus(2);
        },function(){
            $scope.feedback.changeStatus(3);
        });
    },
    function(){
        $scope.feedback.changeStatus(3);
    });

    //Launch
    //if(typeof $routeParams.idSupermercato!='undefined')
    //    $scope.$emit("id");
    
    $scope.getAllSupermercatiIds= function(property)
    {
        var ret=[];
        for(var i=0; i<$scope.supermercati.length; i++)
        {
            if(property!='undefined')
            {
                var match= true;
                for(var p in property)
                {
                    if($scope.supermercati[i][p]!= property[p])
                    {
                        match= false;
                        break;
                    }
                }
                
                if(match)
                {
                    ret.push($scope.supermercati[i].id);
                }
            }
            else
                ret.push($scope.supermercati[i].id);
        }
        return ret;
    }

    $scope.filterFirst= {
        initSelection : function (element, callback) {
          callback($(element).data('$ngModelController').$modelValue);
        }
    }

    $scope.incrementPagination= function()
    {
        if($scope.supermercati.length>$scope.pagination.currentPage())
            $scope.pagination.page++;
    }

    $scope.openProducts= function(supermercato)
    {
       localStorage.supermercato= JSON.stringify(supermercato);
       SupermercatoService.getInfo();
       $location.path('/'+$routeParams.token+'/prodotti/'+supermercato.id);
    }

    $scope.openDetails= function(supermercato)
    {
       localStorage.supermercato= JSON.stringify(supermercato);
       SupermercatoService.getInfo();
       $location.path('/'+$routeParams.token+'/supermercato/'+supermercato.id);
    }

    $scope.openNew= function()
    {
        $scope.supermercato.resetInfo();
        localStorage.supermercato= JSON.stringify($scope.supermercato.info);
        $location.path('/'+$routeParams.token+'/supermercato/nuovo');
    }

    $scope.addCapoEquipe= function()
    {
        if($scope.newCapoEquipe.nome!='')
        {
            var newCapoEquipe= new InsertInfoFactory({
                values: [{nome: $scope.newCapoEquipe.nome, email: "", telefono:""}]
            });

            newCapoEquipe.$save({
                    token: $routeParams.token,
                    property: 'capi_equipe'
                },
                function(result)
                {
                    $scope.newCapoEquipe.status=0;
                    var ce= {id:result.capi_equipe.id,nome: $scope.newCapoEquipe.nome, email: "", telefono:""};
                    $scope.capi_equipe[result.capi_equipe.id]= ce;
                    $scope.capi_equipe_array.push(ce);
                }
            );
        }
        else
        {
            $scope.newCapoEquipe.status=0;
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
