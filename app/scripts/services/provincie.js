collettaApp.service('ProvincieService', ["$q", function($q)
{
	var def= $q.defer();
    return{
    	def: def,
    	prom: def.promise,
        provincie: []
    }
}]);