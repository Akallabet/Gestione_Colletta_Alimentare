collettaApp.service('ServerAddress', function()
{
    var s= 'http://localhost/api.gnca/index.php/';
    //var s= 'http://colletta.gncasicilia.org/api/#/';
    // var s= '../api/index.php/';
    return{
        getServerAddress: function(){return s;}
    }
});
