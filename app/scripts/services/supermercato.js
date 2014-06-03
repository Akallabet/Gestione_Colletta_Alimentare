
collettaApp.service('SupermercatoService', ['$q',function($q)
{
    return{
        default: {
            nome: '',
            indirizzo: '',
            id_comune: '',
            id_provincia: '',
            id_catena: '',
            id_area: '',
            id_colletta: '',
            capo_equipe: null
        },
        info: {
            nome: '',
            indirizzo: '',
            id_comune: '',
            id_provincia: '',
            id_catena: '',
            id_area: '',
            id_colletta: '',
            capo_equipe: null
        },
        mod: {},
        getInfo: function(supermercato)
        {
            $.extend(this.info, supermercato);
//            this.info= $.parseJSON(localStorage.supermercato);
        },
        resetInfo: function()
        {
            $.extend(this.info, this.default);
        }
    }
}]);
