
collettaApp.service('SupermercatoService', ['$q',function($q)
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

    return{
        mod: {},
        info:{},
        getInfo: function()
        {
            $.extend(true, this.info, getSupermercatoInfo($.parseJSON(localStorage.supermercato)));
            console.log(this.info);
        },
        resetInfo: function()
        {
            $.extend(true, this.info, getSupermercatoInfo({}));
        }
    }
}]);
