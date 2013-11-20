'use strict';
var catene=[];
collettaApp.controller('SupermercatiCtrl',['$scope', '$q', '$resource', '$location', '$routeParams', 'GetInfoFactory', 'SetInfoFactory', 'SupermercatiService', 'ComuniService', 'CateneService', 'CapiEquipeService','AdminPagesService', 'CaricoService', 'VersionService', 'CollettaService', 'PagesService',
function($scope, $q, $resource, $location, $routeParams, GetInfoFactory, SetInfoFactory, SupermercatiService, ComuniService, CateneService, CapiEquipeService, AdminPagesService, CaricoService, VersionService, CollettaService, PagesService)
{
    AdminPagesService.section='supermercati';
    $scope.version= VersionService.version;
    $scope.supermercati= SupermercatiService.supermercati=[];
    $scope.colletta= CollettaService.colletta;
    $scope.collettaPromise= CollettaService.collettaPromise;
    $scope.checkedAll= 0;
    $scope.columns=[];
    $scope.getComuneById= getComuneById;
    $scope.chosenSuperm= 2;
    $scope.provincie= [];
    $scope.comuni= ComuniService.comuni;
    $scope.catene= CateneService.catene;
    $scope.capi_equipe= CapiEquipeService.capi_equipe;
    $scope.capi_equipe_supermercati= CapiEquipeService.capi_equipe_supermercati;
    $scope.pages= PagesService.pages;
    $scope.pagesPromise= PagesService.prom;
    
    $scope.pagesPromise.then(function(){
        $scope.pages.map(function(p){ return p.selected= (p.label=='Supermercati') ? 1 : 0;});
        console.log($scope.pages);
    });

    $scope.pagination={
        page:1,
        itemsPerPage:50,
        currentPage: function()
        {
            return $scope.pagination.page*$scope.pagination.itemsPerPage;
        }
    }

    $scope.search={
        visible: true,
        provincia: '',
        comune: '',
        catena: ''
    }

    $scope.capi_equipe_deferred= $q.defer();
    $scope.capi_equipe_promise= $scope.capi_equipe_deferred.promise;

    $scope.capi_equipe_supermercati_deferred= $q.defer();
    $scope.capi_equipe_supermercati_promise= $scope.capi_equipe_supermercati_deferred.promise;
    
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
                $scope.comuni= comuniFactory.comuni;
                $scope.provincie= _.uniq($scope.comuni.map(function(c){ return {id: c.id_provincia, nome: c.provincia}}), 'id');
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
                $scope.catene= cateneFactory.catene;
                CateneService.def.resolve();
                catene= $scope.catene;
            });
        }
    }
    $scope.stuffs= [
                {
                 "name":"thing1",
                 "desc":"this is the first thing"
                },
                {
                 "name":"thing2",
                 "desc":"this is the second thing"
                }
               ]
    
    $scope.getCapiEquipe= function()
    {
        var capi_equipeFactory= new GetInfoFactory();

        capi_equipeFactory.$save({
            token: $routeParams.token,
            property: 'capi_equipe'
        },function()
        {
            for (var i = 0; i < capi_equipeFactory.capi_equipe.length; i++) {
                $scope.capi_equipe[capi_equipeFactory.capi_equipe[i].id]= $.extend({supermercati: []},capi_equipeFactory.capi_equipe[i]);
            }
            $scope.capi_equipe_deferred.resolve();
        });
    }

    $scope.getCapiEquipeSupermercati= function()
    {
        var capi_equipe_supermercatiFactory= new GetInfoFactory();

        capi_equipe_supermercatiFactory.$save({
            token: $routeParams.token,
            property: 'capi_equipe_supermercati'
        },function()
        {
            $scope.capi_equipe_supermercati= capi_equipe_supermercatiFactory.capi_equipe_supermercati;
            /*
            for(var i=0;i<capi_equipe_supermercatiFactory.capi_equipe_supermercati.length;i++)
            {
                var sup_tmp= capi_equipe_supermercatiFactory.capi_equipe_supermercati[i];
                $scope.capi_equipe[sup_tmp.id_capo_equipe].supermercati.push(sup_tmp.id_supermercato);
            }*/
            $scope.capi_equipe_supermercati_deferred.resolve();
        });
    }

    $scope.getSupermercati= function(id)
    {
        var query= {};
        if($scope.search.comune!=null && $scope.search.comune!='') query.id_comune= $scope.search.comune;
        if($scope.search.provincia!=null && $scope.search.provincia!='') query.id_provincia= $scope.search.provincia;
        if($scope.search.catena!=null && $scope.search.catena!='') query.id_catena= $scope.search.catena;
        
        query.id_colletta= $scope.colletta.filter(function(c){return c.attiva==true})[0].id;

        var superm= new GetInfoFactory(
            query
        );
        
        superm.$save({
            token: $routeParams.token,
                property: 'supermercati'
            },
            function(){
            $scope.supermercati.length=0;

            //Capi equipe
            for(var i=0;i<$scope.capi_equipe_supermercati.length;i++)
            {
                var sup_tmp= $scope.capi_equipe_supermercati[i];
                $scope.capi_equipe[sup_tmp.id_capo_equipe].supermercati.push(sup_tmp.id_supermercato);
            }

            for(var i in superm.supermercati)
            {
                superm.supermercati[i].catena= $scope.catene.filter(function(c){ return c.id==superm.supermercati[i].id_catena}).map(function(c){return c.nome})[0];
                superm.supermercati[i].comune= $scope.comuni.filter(function(c){ return c.id==superm.supermercati[i].id_comune}).map(function(c){return c.nome})[0];
                superm.supermercati[i].provincia= $scope.comuni.filter(function(c){ return c.id==superm.supermercati[i].id_comune}).map(function(c){return c.provincia})[0];
                superm.supermercati[i].capi_equipe=[];
                for (var j in $scope.capi_equipe) {
                    if($scope.capi_equipe[j].supermercati.indexOf(superm.supermercati[i].id)!=-1)
                    {
                        superm.supermercati[i].capi_equipe.push($scope.capi_equipe[j]);
                    }
                };
                $scope.supermercati.push(SupermercatiService.supermercato(superm.supermercati[i]));
            }
            $scope.chosenSuperm= $scope.supermercati[0].id;
            $scope.search.visible= false;
        });
    }

    function addInfoToSupermercati()
    {
        
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

    $scope.$on("id", function()
    {
        $scope.getSupermercati($routeParams.idSupermercato);
    });
    $scope.$on("comuni", function()
    {
        $scope.getComuni();
    });
    $scope.$on("catene", function()
    {
        $scope.getCatene();
    });
    $scope.$on("capi_equipe", function()
    {
        $scope.getCapiEquipe();
        $scope.getCapiEquipeSupermercati();
    });

    $q.all([$scope.capi_equipe_promise,
            $scope.capi_equipe_supermercati_promise,
            $scope.collettaPromise,
            ComuniService.prom,
            CateneService.prom,
            ]).then(function(){
        $scope.getSupermercati();
    });

    //Launch
    if(typeof $routeParams.idSupermercato!='undefined')
        $scope.$emit("id");
    
    $scope.$emit("comuni");
    $scope.$emit("catene");
    $scope.$emit("capi_equipe");

    $scope.openDetails= function(id)
    {
        localStorage.supermercato= JSON.stringify($scope.supermercati.filter(function(sup){return sup.id==id;})[0]);
        $location.path('/'+$routeParams.token+'/prodotti/'+id);
    }
    
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

    $scope.toggleSelected= function(supermercato)
    {
        //console.log('lalala');
        //console.log(supermercato);
        //$scope.supermercati.map(function(s){});
    }

    $scope.enableChecked= function()
    {

    }

    $scope.disableChecked= function()
    {
        
    }

    $scope.incrementPagination= function()
    {
        if($scope.supermercati.length>$scope.pagination.currentPage())
            $scope.pagination.page++;
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