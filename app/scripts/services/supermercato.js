
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
            nome: null,
            indirizzo: null,
            id_comune: '',
            id_provincia: '',
            id_catena: '',
            id_area: '',
            id_colletta: ''
        },
        mod: {}
    }
}]);