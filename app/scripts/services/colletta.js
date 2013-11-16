collettaApp.service('CollettaService', ["$q", function($q)
{
	var def= $q.defer();
    return{
    	collettaDeferred: def,
    	collettaPromise: def.promise,
        colletta: [],
        active: '',
        files: []
    }
}]);