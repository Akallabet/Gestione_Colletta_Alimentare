
collettaApp.service('SupermercatoService', ['$q',function($q)
{
    return{
    	modalButtons:[
            {label: "ok", type: "primary", active: true, action: 'ok'},
            {label: "elimina", type: "danger", active: true, action: 'del'},
            {label: "annulla", type: "warning", active: true, action: 'dismiss'}
        ],
        modalTitle: "",
        tmpl: {
            nome: '',
            indirizzo: '',
            id_comune: '',
            id_catena: '',
            capi_equipe: [],
            id_area: 1
        },
        mod: {}
    }
}]);