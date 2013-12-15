'use strict';
var catene=[];
collettaApp.controller('SupermercatiCtrl',['$scope', '$q', '$resource', '$location', '$routeParams', '$modal', 'GetInfoFactory', 'SetInfoFactory', 'SupermercatiService', 'ComuniService', 'CateneService', 'CapiEquipeService','AdminPagesService', 'CaricoService', 'VersionService', 'CollettaService', 'SupermercatoService', 'InsertInfoFactory', 'ProvincieService', 'AreeService', 'FilterService',
function($scope, $q, $resource, $location, $routeParams, $modal, GetInfoFactory, SetInfoFactory, SupermercatiService, ComuniService, CateneService, CapiEquipeService, AdminPagesService, CaricoService, VersionService, CollettaService, SupermercatoService, InsertInfoFactory, ProvincieService, AreeService, FilterService)
{
    AdminPagesService.section='supermercati';
    $scope.version= VersionService.version;
    $scope.supermercati= SupermercatiService.supermercati;
    $scope.newSupermercati= SupermercatiService.tmpl;
    $scope.colletta= CollettaService.colletta;
    $scope.collettaPromise= CollettaService.collettaPromise;
    $scope.checkedAll= 0;
    $scope.columns=[];
    $scope.getComuneById= getComuneById;
    $scope.chosenSuperm= 2;
    $scope.provincie= ProvincieService.provincie;
    $scope.comuni= ComuniService.comuni;
    $scope.aree= AreeService.aree;
    $scope.catene= CateneService.catene;
    $scope.capi_equipe= CapiEquipeService.capi_equipe;
    $scope.capi_equipe_array= CapiEquipeService.capi_equipe_array;
    $scope.capi_equipe_supermercati= CapiEquipeService.capi_equipe_supermercati;
    $scope.supTmpl= SupermercatoService.tmpl;

    $scope.pagination={
        page:1,
        itemsPerPage:50,
        currentPage: function()
        {
            return $scope.pagination.page*$scope.pagination.itemsPerPage;
        }
    }

    $scope.filter= FilterService;

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
        else
            ComuniService.def.resolve();
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
        else
            CateneService.def.resolve();
    }

    $scope.getAree= function()
    {
        if($scope.aree.length==0)
        {
            var areeFactory= new GetInfoFactory();
            areeFactory.$save({
                token: $routeParams.token,
                property: 'aree'
            },function()
            {
                for (var i = 0; i < areeFactory.aree.length; i++) {
                    $scope.aree.push(areeFactory.aree[i]);
                }
                AreeService.def.resolve();
            });
        }
        else
            AreeService.def.resolve();
    }

    $scope.getCapiEquipe= function()
    {
        if($scope.capi_equipe_array.length==0)
        {
            var capi_equipeFactory= new GetInfoFactory();

            capi_equipeFactory.$save({
                token: $routeParams.token,
                property: 'capi_equipe'
            },function()
            {
                for (var i = 0; i < capi_equipeFactory.capi_equipe.length; i++) {
                    $scope.capi_equipe[capi_equipeFactory.capi_equipe[i].id]= $.extend({supermercati: []},capi_equipeFactory.capi_equipe[i]);
                    $scope.capi_equipe_array.push($scope.capi_equipe[capi_equipeFactory.capi_equipe[i].id]);
                }
                $scope.capi_equipe_deferred.resolve();
            });
        }
        else
            $scope.capi_equipe_deferred.resolve();
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

    function getSupermercati(refresh)
    {
        if(refresh || $scope.supermercati.length==0)
        {
            var superm= new GetInfoFactory(
                {
                    id_colletta: $scope.colletta.filter(function(c){return c.attiva==1})[0].id
                }
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
                    if(typeof $scope.capi_equipe[sup_tmp.id_capo_equipe]!='undefined')
                        $scope.capi_equipe[sup_tmp.id_capo_equipe].supermercati.push(sup_tmp.id_supermercato);
                }
        
                for(var i=0; i<superm.supermercati.length;i++)
                {
                    superm.supermercati[i].catena= $scope.catene.filter(function(c){ return c.id==superm.supermercati[i].id_catena})[0];
                    superm.supermercati[i].comune= $scope.comuni.filter(function(c){ return c.id==superm.supermercati[i].id_comune}).map(function(c){return c.nome})[0];
                    superm.supermercati[i].provincia= $scope.comuni.filter(function(c){ return c.id==superm.supermercati[i].id_comune}).map(function(c){return c.provincia})[0];
                    superm.supermercati[i].capi_equipe={};

                    for (var j in $scope.capi_equipe){
                        if(typeof $scope.capi_equipe[j].supermercati!='undefined')
                        {
                            if($scope.capi_equipe[j].supermercati.indexOf(superm.supermercati[i].id)!=-1)
                            {
                                superm.supermercati[i].capi_equipe= $.extend({}, $scope.capi_equipe[j]);
                            }
                        }
                    };
                    $scope.supermercati.push(SupermercatiService.supermercato(superm.supermercati[i]));
                }
                //console.log($scope.supermercati);
                //$scope.chosenSuperm= $scope.supermercati[0].id;
                $scope.filter.visible= false;
            });
        }
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

    $scope.$on("comuni", function()
    {
        $scope.getComuni();
    });
    $scope.$on("catene", function()
    {
        $scope.getCatene();
    });
    $scope.$on("aree", function()
    {
        $scope.getAree();
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
        getSupermercati(false);
    });
    //Launch
    //if(typeof $routeParams.idSupermercato!='undefined')
    //    $scope.$emit("id");
    
    $scope.$emit("comuni");
    $scope.$emit("catene");
    $scope.$emit("aree");
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

    $scope.openNewSupermercato = function () {
        SupermercatoService.modalTitle= "Nuovo Supermercato";
        SupermercatoService.modalButtons[0].active= true;
        SupermercatoService.modalButtons[1].active= false;
        SupermercatoService.modalButtons[2].active= true;

        var modalInstance = $modal.open({
            templateUrl: 'supermercatiModal.html',
            controller: SupermercatoCtrl,
            resolve: {
                
            }
        });

        modalInstance.result.then(function (action, selectedItem) {
            if(action=='ok') saveSupermercato();
            else if(action=='dismiss')
            {

            }
        },function () {

        });
    }

    $scope.openSetSupermercato = function (supermercato) {
        $scope.supTmpl.id= supermercato.id;
        $scope.supTmpl.id_catena= supermercato.id_catena;
        $scope.supTmpl.indirizzo= supermercato.indirizzo;
        $scope.supTmpl.id_area= supermercato.id_area;
        $scope.supTmpl.nome= supermercato.nome;
        $scope.supTmpl.id_comune= supermercato.id_comune;
        $scope.supTmpl.id_provincia= supermercato.id_provincia;

        SupermercatoService.modalTitle= "Modifica Supermercato";
        SupermercatoService.modalButtons[0].active= true;
        SupermercatoService.modalButtons[1].active= false;
        SupermercatoService.modalButtons[2].active= true;
        
        var modalInstance = $modal.open({
            templateUrl: 'supermercatiModal.html',
            controller: SupermercatoCtrl,
            resolve: {
                
            }
        });

        modalInstance.result.then(function (action,selectedItem) {
            if(action=='ok') setSupermercato();
            else if(action=='dismiss')
            {

            }
        },function () {
            
            //$log.info('Modal dismissed at: ' + new Date());
        });
    }

    function setSupermercato()
    {
        var tmp_id= $scope.supTmpl.id;
        delete $scope.supTmpl.id;
        $scope.supTmpl.id_provincia= $scope.comuni.filter(function(c){return c.id==$scope.supTmpl.id_comune})[0].id_provincia;
        $scope.supTmpl.id_colletta= $scope.colletta.filter(function(c){return c.attiva==1})[0].id;
        
        var setSup= new SetInfoFactory({
            values: [$scope.supTmpl],
            set: [{id: tmp_id}]
        });
        setSup.$save({
            token: $routeParams.token,
            property: 'supermercati'
        },
        function(){
            getSupermercati(true);
        });
    }

    function saveSupermercato()
    {
        $scope.supTmpl.id_colletta= $scope.colletta.filter(function(c){return c.attiva==1})[0].id;
        $scope.supTmpl.id_provincia= $scope.comuni.filter(function(c){return c.id==$scope.supTmpl.id_comune})[0].id_provincia;
        var newSupermercato= new InsertInfoFactory({
            values: [$scope.supTmpl]
        });

        newSupermercato.$save({
            token: $routeParams.token,
            property: 'supermercati'
        },
        function(){
            if(typeof newSupermercato.supermercati!='undefined' && typeof newSupermercato.supermercati.id!='undefined')
            {
                getSupermercati(true);
            }
            else
            {    
                getSupermercati(true);
            }
        });
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