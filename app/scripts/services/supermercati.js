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

    return{
        supermercato: function(obj){
            return new Supermercato(obj);
        },
        supermercati: []
    }
}]);
