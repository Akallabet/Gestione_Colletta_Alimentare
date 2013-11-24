collettaApp.service('ServerAddress', function()
{
    var s= '../api/index.php/';
    //var s= 'http://colletta.gncasicilia.org/api/#/';
    return{
        getServerAddress: function(){return s;}
    }
});