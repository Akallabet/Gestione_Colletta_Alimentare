
collettaApp.service('SupermercatoService', ['$q',function($q)
{
    return{
    	modalButtons:[
            {label: "ok", type: "primary", active: true},
            {label: "elimina", type: "danger", active: true},
            {label: "annulla", type: "warning", active: true}
        ],
        modalTitle: ""
    }
}]);