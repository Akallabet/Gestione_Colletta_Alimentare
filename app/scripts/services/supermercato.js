
collettaApp.service('SupermercatoService', ['$q', 'SetInfoFactory', '$routeParams', function($q, SetInfoFactory, $routeParams)
{
    function getSupermercatoInfo(obj)
    {
        return {
            id: (typeof obj.id!='undefined') ? obj.id : '',
            nome: (typeof obj.nome!='undefined') ? obj.nome : '',
            indirizzo: (typeof obj.indirizzo!='undefined') ? obj.indirizzo : '',
            id_comune: (typeof obj.id_comune!='undefined') ? obj.id_comune : '',
            id_provincia: (typeof obj.id_provincia!='undefined') ? obj.id_provincia : '',
            id_catena: (typeof obj.id_catena!='undefined') ? obj.id_catena : '',
            id_area: (typeof obj.id_area!='undefined') ? obj.id_area : '',
            id_colletta: (typeof obj.id_colletta!='undefined') ? obj.id_colletta : '',
            capo_equipe: (typeof obj.capo_equipe!='undefined') ? obj.capo_equipe : {nome: '', id: ''},
        }
    }
    var def= $q.defer();
    return{
        def: def,
        prom: def.promise,
        mod: {},
        info:{},
        getInfo: function()
        {
            $.extend(true, this.info, getSupermercatoInfo($.parseJSON(localStorage.supermercato)));
        },
        resetInfo: function()
        {
            $.extend(true, this.info, getSupermercatoInfo({}));
        },
        setInfo: function()
        {
            var $this= this;

            var tmpSupermercato= $.extend({}, $this.info);
            delete tmpSupermercato.capo_equipe;
            
            var setSup= new SetInfoFactory({
                values: [tmpSupermercato],
                set: [{id: tmpSupermercato.id}]
            });
            setSup.$save({
                token: $routeParams.token,
                property: 'supermercati'
            },
            function(){
                $this.def.notify(true);
            });
        }
    }
}]);
