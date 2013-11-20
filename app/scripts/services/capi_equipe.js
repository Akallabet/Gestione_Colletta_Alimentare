collettaApp.service('CapiEquipeService', ["$q", function($q)
{
	var def= $q.defer();
    return{
    	def: def,
    	prom: def.promise,
        capi_equipe: {},
        capi_equipe_supermercati: {}
    }
}]);