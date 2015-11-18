collettaApp.service('CateneService', ['$q', 'GetInfoFactory', '$routeParams', function($q, GetInfoFactory, $routeParams)
{
	var def= $q.defer();
    return{
    	def: def,
    	prom: def.promise,
        catene: [],
        getInfo: function(refresh)
        {
        	var $this= this;
        	if(refresh || $this.catene.length==0)
	        {
	            var cateneFactory= new GetInfoFactory();
	            cateneFactory.$save({
	                token: $routeParams.token,
	                property: 'catene'
	            },function()
	            {
	                for (var i = 0; i < cateneFactory.catene.length; i++) {
	                    $this.catene.push(cateneFactory.catene[i]);
	                }
	                $this.def.resolve();
	            });
	        }
	        else
	            $this.def.resolve();
        }
    }
}]);