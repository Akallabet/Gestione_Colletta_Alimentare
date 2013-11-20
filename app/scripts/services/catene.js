collettaApp.service('CateneService', ["$q", function($q)
{
	var def= $q.defer();
    return{
    	def: def,
    	prom: def.promise,
        catene: []
    }
}]);