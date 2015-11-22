collettaApp.service('ServerAddress', ['$location', function($location)
{
    // var s= 'http://localhost/api.gnca/index.php/';
    //var s= 'http://colletta.gncasicilia.org/api/#/';
    // var s= '../api/index.php/';
    return{
        getServerAddress: function(){
        	var ret='';
        	if($location.$$host=='localhost')
        	{
        		ret= 'http://localhost/api.gnca/index.php/';
        	}
        	else
        	{
        		ret= '../api/index.php/';
        	}
        	return ret;
        }
    }
}]);
