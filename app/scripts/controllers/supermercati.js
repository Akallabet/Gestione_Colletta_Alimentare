'use strict';
var catene=[];
var SupermercatiCtrl=['$scope', '$resource', '$location', '$routeParams', 'GetInfoFactory', 'SetInfoFactory', 'SupermercatiService', 'ComuniService', 'CateneService', 'CapiEquipeService','AdminPagesService', 'CaricoService',
function($scope, $resource, $location, $routeParams, GetInfoFactory, SetInfoFactory, SupermercatiService, ComuniService, CateneService, CapiEquipeService, AdminPagesService, CaricoService)
{
    AdminPagesService.section='supermercati';
    $scope.supermercati= SupermercatiService.supermercati=[];
    $scope.checkedAll= 0;
    $scope.pages= 1;
    $scope.columns=[];
    $scope.getComuneById= getComuneById;
    $scope.chosenSuperm= 2;
    $scope.provincie= [];
    $scope.comuni= ComuniService.comuni;
    $scope.catene= CateneService.catene;
    $scope.capi_equipe= CapiEquipeService.capi_equipe;
    $scope.rowsNumber= 15;
    $scope.currentPage=1;
    $scope.search={
        visible: true,
        provincia: '',
        comune: '',
        catena: ''
    }

    $scope.totalPages= function()
    {
        return Math.round($scope.supermercati.length/$scope.rowsNumber);
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
                $scope.comuni= comuniFactory.comuni;
                $scope.provincie= _.uniq($scope.comuni.map(function(c){ return {id: c.id_provincia, nome: c.provincia}}), 'id');

                for(var i=0; i<$scope.supermercati.length; i++)
                {
                    for(var j=0; j<$scope.comuni.length; j++)
                    {
                        if($scope.supermercati[i].id_comune==$scope.comuni[j].id)
                        {
                            $scope.supermercati[i].comune= $scope.comuni[j].nome;
                            $scope.supermercati[i].provincia= $scope.comuni[j].provincia;
                            break;
                        }
                    }
                }
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
                for(var i=0; i<$scope.supermercati.length; i++)
                {
                    for(var j=0; j<$scope.catene.length; j++)
                    {
                        if($scope.supermercati[i].id_catena==$scope.catene[j].id)
                        {
                            $scope.supermercati[i].catena= $scope.catene[j].nome;
                            break;
                        }
                    }
                }
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
        var capi_equipeFactory= new GetInfoFactory({
            id_supermercato:{'IN' : $scope.getAllSupermercatiIds()}
        });

        capi_equipeFactory.$save({
            token: $routeParams.token,
            property: 'capi_equipe'
        },function()
        {
            $scope.capi_equipe= capi_equipeFactory.capi_equipe;
            for(var i=0; i<$scope.capi_equipe.length; i++)
            {
                for(var j=0; j<$scope.supermercati.length; j++)
                {
                    if($scope.capi_equipe[i].id_supermercato==$scope.supermercati[j].id)
                    {
                        $scope.supermercati[j].capi_equipe.push($scope.capi_equipe[i]);
                        break;
                    }
                }
            }
        });
    }

    $scope.getSupermercati= function(id)
    {
        var query= {};
        if($scope.search.comune!=null && $scope.search.comune!='') query.id_comune= $scope.search.comune;
        if($scope.search.provincia!=null && $scope.search.provincia!='') query.id_provincia= $scope.search.provincia;
        if($scope.search.catena!=null && $scope.search.catena!='') query.id_catena= $scope.search.catena;

        var superm= new GetInfoFactory(
            query
        );
        
        superm.$save({
            token: $routeParams.token,
                property: 'supermercati'
            },
            function(){
            for(var i in superm.supermercati)
            {
                superm.supermercati[i].catena= $scope.catene.filter(function(c){ return c.id==superm.supermercati[i].id_catena}).map(function(c){return c.nome})[0];
                superm.supermercati[i].comune= $scope.comuni.filter(function(c){ return c.id==superm.supermercati[i].id_comune}).map(function(c){return c.nome})[0];
                superm.supermercati[i].provincia= $scope.comuni.filter(function(c){ return c.id==superm.supermercati[i].id_comune}).map(function(c){return c.provincia})[0];
                $scope.supermercati.push(SupermercatiService.supermercato(superm.supermercati[i]));
            }
            $scope.chosenSuperm= $scope.supermercati[0].id;
            $scope.pages= $scope.totalPages();
            $scope.$emit("capi_equipe");
            $scope.search.visible= false;
        });
    }

    $scope.setToggledSupermercati= function(bool)
    {
        //console.log($scope.getAllSupermercatiIds({checked: true}))
        var set= new SetInfoFactory({
            values: {
                id_supermercato:{'IN' : $scope.getAllSupermercatiIds({checked: 1})}
            },
            set:{
                confermato: bool
            }
        });
        
        set.$save({
            token: $routeParams.token,
            property: 'supermercati'
        },
        function()
        {

        });
    }

    $scope.$on("all", function()
    {
        $scope.getSupermercati();
    });
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
    });

    if(typeof $routeParams.idSupermercato!='undefined')
        $scope.$emit("id");
    //else $scope.$emit("all");
    $scope.$emit("comuni");
    $scope.$emit("catene");

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
}];

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