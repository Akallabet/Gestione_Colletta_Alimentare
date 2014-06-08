collettaApp.service('UserInfoService', ['$q',  'GetInfoFactory', '$routeParams', 'UserInfoFactory', function($q, GetInfoFactory, $routeParams, UserInfoFactory)
{
	var def= $q.defer();
    function User(obj){
        return $.extend({}, {
            nome: null,
            cognome: null,
            email: null,
            privilegi: null,
            ruolo: null,
            telefono: null,
            username: null,
            pages: [],
        }, obj);
    }

    return{
    	def: def,
    	prom: def.promise,
        user: {
            nome: null,
            cognome: null,
            email: null,
            privilegi: null,
            ruolo: null,
            telefono: null,
            username: null,
            pages: [],
        },
        userObj: function(obj){
            return new User(obj);
        },
        getInfo: function()
        {
            var $this= this;
            var usr= UserInfoFactory.get({token: $routeParams.token}, function(){
                if(usr.error)
                {
                    $location.path('/');
                }
                else
                {
                    angular.extend($this.user, usr.user);

                    $this.user.pages.length=0;
                    $this.user.pages.push({url: 'supermercati', label: 'Gestione Carichi', selected: 0});
                    $this.user.pages.push({url: 'gestione_report', label: 'Report', selected: 0});
                    
                    switch(parseInt($this.user.privilegi))
                    {
                        case 1:
        //                $this.user.pages.push({url: 'gestione_supermercati', label: 'Gestione Supermercati', selected: 0});
                        $this.user.pages.push({url: 'gestione_files', label: 'Upload', selected: 0});
                        //{url: 'gestione_catene', label: 'Catene'},
                        //{url: 'gestione_magazzini', label: 'Magazzini', selected: 0},
                        //{url: 'gestione_utenti', label: 'Utenti', selected: 0},
                        break;
                    }
                    $this.def.resolve();
                }
            });
        }
    }
}]);