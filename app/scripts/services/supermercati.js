collettaApp.service('SupermercatiService', ['$q', '$routeParams', 'GetInfoFactory', 'CollettaService', 'ComuniService', 'CapiEquipeService', 'CapiEquipeSupermercatiService', 'CateneService', 'FilterService',
 function($q, $routeParams, GetInfoFactory, CollettaService, ComuniService, CapiEquipeService, CapiEquipeSupermercatiService, CateneService, FilterService)
 {
    function Supermercato(obj){
        return $.extend({}, {
            index: null,
            checked: false,
            id: null,
            id_supermercato: null,
            id_colletta: null,
            colletta:null,
            id_catena: null,
            catena: null,
            nome: null,
            id_magazzino: null,
            id_area: null,
            id_comune: null,
            provincia: null,
            comune: null,
            confermato: null,
            indirizzo: null,
            id_diocesi: null,
            capo_equipe: {nome: '', id: ''}
        }, obj);
    }
    
    var def= $q.defer();

    return{
        supermercato: function(obj){
            return new Supermercato(obj);
        },
        def: def,
        prom: def.promise,
        supermercati: [],
        getInfo: function(refresh)
        {
            var $this= this;
            var res= null;
            if(refresh || $this.supermercati.length==0)
            {
                var superm= new GetInfoFactory(
                    {
                        id_colletta: CollettaService.colletta.filter(function(c){return c.attiva==1})[0].id
                    }
                );
                
                res= superm.$save(
                {
                    token: $routeParams.token,
                    property: 'supermercati'
                },
                function()
                {
                    $this.supermercati.length=0;
                    
                    //Capi equipe
                    for(var i=0;i<CapiEquipeSupermercatiService.capi_equipe_supermercati.length;i++)
                    {
                        var sup_tmp= CapiEquipeSupermercatiService.capi_equipe_supermercati[i];
                        if(typeof CapiEquipeService.capi_equipe[sup_tmp.id_capo_equipe]!='undefined')
                            CapiEquipeService.capi_equipe[sup_tmp.id_capo_equipe].supermercati.push(sup_tmp.id_supermercato);
                    }
            
                    for(var i=0; i<superm.supermercati.length;i++)
                    {
                        superm.supermercati[i].id_supermercato= Math.round(superm.supermercati[i].id_supermercato);
                        superm.supermercati[i].catena= CateneService.catene.filter(function(c){ return c.id==superm.supermercati[i].id_catena})[0];
                        superm.supermercati[i].comune= ComuniService.comuni.filter(function(c){ return c.id==superm.supermercati[i].id_comune}).map(function(c){return c.nome})[0];
                        superm.supermercati[i].provincia= ComuniService.comuni.filter(function(c){ return c.id==superm.supermercati[i].id_comune}).map(function(c){return c.provincia})[0];

                        for (var j in CapiEquipeService.capi_equipe){
                            if(typeof CapiEquipeService.capi_equipe[j].supermercati!='undefined')
                            {
                                if(CapiEquipeService.capi_equipe[j].supermercati.indexOf(superm.supermercati[i].id)!=-1)
                                {
                                    superm.supermercati[i].capo_equipe= $.extend({}, CapiEquipeService.capi_equipe[j]);
                                }
                            }
                        };
                        $this.supermercati.push($this.supermercato(superm.supermercati[i]));
                    }
                    //console.log($scope.supermercati);
                    //$scope.chosenSuperm= $scope.supermercati[0].id;
                    FilterService.filter.visible= false;
                });
            }
            else
            {
                var def= $q.defer();
                res= def.promise;
                def.resolve();
            }
            return res;
        }
    }
}]);
