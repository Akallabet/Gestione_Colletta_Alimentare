collettaApp.service('ServerAddress', function()
{
    //var s= 'http://178.62.59.76/api.gnca/index.php/';
	var s= location.protocol+'//'+location.host+'/api.gnca/index.php/';
    //var s= 'http://colletta.gncasicilia.org/api/#/';
    // var s= '../api/index.php/';
    return{
        getServerAddress: function(){return s;}
    }
});
