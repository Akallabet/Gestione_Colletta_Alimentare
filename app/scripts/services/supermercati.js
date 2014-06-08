collettaApp.service('SupermercatiService', ['$q', function($q){
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
            capo_equipe: {nome:""}
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
        getInfo: function()
        {
            // var $this= this;
            // if(refresh || $scope.supermercati.length==0)
            // {
            //     var superm= new GetInfoFactory(
            //         {
            //             id_colletta: $scope.colletta.filter(function(c){return c.attiva==1})[0].id
            //         }
            //     );
                
            //     superm.$save({
            //         token: $routeParams.token,
            //             property: 'supermercati'
            //         },
            //         function(){
            //         $scope.supermercati.length=0;
                    
            //         //Capi equipe
            //         for(var i=0;i<$scope.capi_equipe_supermercati.length;i++)
            //         {
            //             var sup_tmp= $scope.capi_equipe_supermercati[i];
            //             if(typeof $scope.capi_equipe[sup_tmp.id_capo_equipe]!='undefined')
            //                 $scope.capi_equipe[sup_tmp.id_capo_equipe].supermercati.push(sup_tmp.id_supermercato);
            //         }
            
            //         for(var i=0; i<superm.supermercati.length;i++)
            //         {
            //             superm.supermercati[i].catena= $scope.catene.filter(function(c){ return c.id==superm.supermercati[i].id_catena})[0];
            //             superm.supermercati[i].comune= $scope.comuni.filter(function(c){ return c.id==superm.supermercati[i].id_comune}).map(function(c){return c.nome})[0];
            //             superm.supermercati[i].provincia= $scope.comuni.filter(function(c){ return c.id==superm.supermercati[i].id_comune}).map(function(c){return c.provincia})[0];

            //             for (var j in $scope.capi_equipe){
            //                 if(typeof $scope.capi_equipe[j].supermercati!='undefined')
            //                 {
            //                     if($scope.capi_equipe[j].supermercati.indexOf(superm.supermercati[i].id)!=-1)
            //                     {
            //                         superm.supermercati[i].capo_equipe= $.extend({}, $scope.capi_equipe[j]);
            //                     }
            //                 }
            //             };
            //             $scope.supermercati.push(SupermercatiService.supermercato(superm.supermercati[i]));
            //         }
            //         //console.log($scope.supermercati);
            //         //$scope.chosenSuperm= $scope.supermercati[0].id;
            //         $scope.filter.visible= false;
            //     });
            // }
        }
    }
}]);
