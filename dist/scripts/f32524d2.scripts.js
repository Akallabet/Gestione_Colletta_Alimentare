function getComuneById(e){var t=null;for(var n in comuni)if(comuni[n].id==e){t=angular.extend({},comuni[n]);break}return t}var comuni=[],versionTmpl="1.1",collettaApp=angular.module("collettaApp",["ngResource","ngRoute","ui.bootstrap","ui.select2"]);collettaApp.config(["$routeProvider",function(e){e.when("/",{templateUrl:"views/login.html?version="+versionTmpl}).when("/:token/home",{templateUrl:"views/home.html?version="+versionTmpl}).when("/:token/gestione_supermercati",{templateUrl:"views/admin/supermercati.html?version="+versionTmpl}).when("/:token/gestione_utenti",{templateUrl:"views/admin/utenti.html?version="+versionTmpl}).when("/:token/gestione_magazzini",{templateUrl:"views/admin/magazzini.html?version="+versionTmpl}).when("/:token/gestione_catene",{templateUrl:"views/admin/catene.html?version="+versionTmpl}).when("/:token/gestione_files",{templateUrl:"views/admin/files.html?version="+versionTmpl}).when("/:token/supermercati",{templateUrl:"views/user/supermercati.html?version="+versionTmpl}).when("/:token/prodotti/:idSupermercato",{templateUrl:"views/user/prodotti.html?version="+versionTmpl}).otherwise({redirectTo:"/"})}]),collettaApp.service("ServerAddress",function(){var e="../api/index.php/";return{getServerAddress:function(){return e}}}),collettaApp.service("VersionService",function(){return{version:versionTmpl}}),collettaApp.service("AdminPagesService",function(){return{sections:[],section:""}}),collettaApp.service("SupermercatiService",["$q",function(){function e(e){return $.extend({},{index:null,checked:!1,id:null,id_supermercato:null,id_colletta:null,colletta:null,id_catena:null,catena:null,nome:null,id_magazzino:null,id_area:null,id_comune:null,provincia:null,comune:null,confermato:null,indirizzo:null,id_diocesi:null,capi_equipe:[]},e)}return{supermercato:function(t){return new e(t)},supermercati:[]}}]),collettaApp.service("CaricoService",["$q",function(){return{prodottiNomi:[{tipo:"OLIO"},{tipo:"OMOGENIZZATI"},{tipo:"ALIMENTI INFANZIA"},{tipo:"TONNO"},{tipo:"CARNE IN SCATOLA"},{tipo:"PELATI"},{tipo:"LEGUMI"},{tipo:"PASTA"},{tipo:"RISO"},{tipo:"ZUCCHERO"},{tipo:"LATTE"},{tipo:"VARIE"}],modalOptions:{title:"Nuovo Carico",buttons:"Nuovo Carico"},newCarico:[{prodotto:"OLIO",kg:0,scatole:0},{prodotto:"OMOGENIZZATI",kg:0,scatole:0},{prodotto:"ALIMENTI INFANZIA",kg:0,scatole:0},{prodotto:"TONNO",kg:0,scatole:0},{prodotto:"CARNE IN SCATOLA",kg:0,scatole:0},{prodotto:"PELATI",kg:0,scatole:0},{prodotto:"LEGUMI",kg:0,scatole:0},{prodotto:"PASTA",kg:0,scatole:0},{prodotto:"RISO",kg:0,scatole:0},{prodotto:"ZUCCHERO",kg:0,scatole:0},{prodotto:"LATTE",kg:0,scatole:0},{prodotto:"VARIE",kg:0,scatole:0}],caricoTmpl:[{prodotto:"OLIO",kg:0,scatole:0},{prodotto:"OMOGENIZZATI",kg:0,scatole:0},{prodotto:"ALIMENTI INFANZIA",kg:0,scatole:0},{prodotto:"TONNO",kg:0,scatole:0},{prodotto:"CARNE IN SCATOLA",kg:0,scatole:0},{prodotto:"PELATI",kg:0,scatole:0},{prodotto:"LEGUMI",kg:0,scatole:0},{prodotto:"PASTA",kg:0,scatole:0},{prodotto:"RISO",kg:0,scatole:0},{prodotto:"ZUCCHERO",kg:0,scatole:0},{prodotto:"LATTE",kg:0,scatole:0},{prodotto:"VARIE",kg:0,scatole:0}],lastId:null}}]),collettaApp.factory("LoginFactory",["$resource","ServerAddress",function(e,t){var n=e(t.getServerAddress()+"login",{});return n}]),collettaApp.factory("LogoutFactory",["$resource","ServerAddress",function(e,t){var n=e(t.getServerAddress()+"logout",{});return n}]),collettaApp.factory("UserInfoFactory",["$resource","ServerAddress",function(e,t){var n=e(t.getServerAddress()+":token/get/user",{token:"@token"});return n}]),collettaApp.factory("GetInfoFactory",["$resource","ServerAddress",function(e,t){var n=e(t.getServerAddress()+":token/get/:property/:limit_start/:limit_end",{token:"@token",property:"@property",limit_start:"@limit_start",limit_end:"@limit_end"});return n}]),collettaApp.factory("SetInfoFactory",["$resource","ServerAddress",function(e,t){var n=e(t.getServerAddress()+":token/set/:property",{token:"@token",property:"@property"});return n}]),collettaApp.factory("InsertInfoFactory",["$resource","ServerAddress",function(e,t){var n=e(t.getServerAddress()+":token/save/prodotti",{token:"@token"});return n}]),collettaApp.directive("toggleAll",function(){return{link:function(e,t){$(t).on("change",function(){$('tbody input[type="checkbox"]').trigger("click")})}}}),collettaApp.controller("LoginCtrl",["$scope","$resource","$location","LoginFactory","VersionService",function(e,t,n,i,o){e.version=o.version,e.alerts=[],e.closeAlerts=function(){e.alerts=[]},e.username="",e.password="",e.login=function(){if(""!==e.username&&""!==e.password){var t=new i({username:e.username,password:e.password});t.$save(function(){arguments[0].error?e.alerts.push({type:"error",disabled:!1,msg:"Nome utente o password errati, riprova!"}):(e.alerts=[],n.path(arguments[0].token+"/home/"))})}}}]),collettaApp.controller("AdminCtrl",["$scope","$resource","$location","$routeParams","UserInfoService","UserInfoFactory","AdminPagesService","LogoutFactory","VersionService",function(e,t,n,i,o,r,a,s,c){e.version=c.version,e.token=i.token,e.sections=a.sections,e.section=a.section,0==e.sections.length&&(e.sections.push({url:"supermercati",label:"Supermercati",active:!1}),e.sections.push({url:"utenti",label:"Utenti",active:!1}),e.sections.push({url:"magazzini",label:"Magazzini",active:!1})),e.sections.map(function(t){return t.active=t.url==e.section?!0:!1})}]),collettaApp.controller("UserCtrl",["$scope","$resource","$location","$routeParams","GetInfoFactory","SetInfoFactory","UserInfoService","UserInfoFactory","LogoutFactory","VersionService","CollettaService",function(e,t,n,i,o,r,a,s,c,l,u){e.version=l.version,e.activePage=i.page,e.token=i.token,e.user=a.user,e.userDef=a.def,e.userProm=a.prom,e.colletta=u.colletta,e.colletta_active=u.active,e.collettaPromise=u.collettaPromise,e.collettaDeferred=u.collettaDeferred,e.files=u.files,e.logout=function(){c.get(function(){n.path("/")})};var h=new o;h.$save({token:i.token,property:"colletta"},function(){e.colletta.length=0;for(var t=0;h.colletta.length>t;t++)e.colletta.push($.extend(h.colletta[t],{attiva:1==h.colletta[t].attiva?!0:!1}));for(var t=0;e.colletta.length>t;t++)e.colletta[t].attiva&&(u.active=$.extend({},e.colletta[t]));e.collettaDeferred.resolve()});var p=s.get({token:e.token},function(){if(p.error)n.path("/");else{switch(angular.extend(e.user,p.user),e.user.pages.length=0,e.user.pages.push({url:"supermercati",label:"Gestione carichi",selected:0}),parseInt(e.user.privilegi)){case 1:e.user.pages.push({url:"gestione_supermercati",label:"Supermercati",selected:0}),e.user.pages.push({url:"gestione_files",label:"Upload",selected:0})}e.userDef.resolve()}})}]),collettaApp.controller("HomeCtrl",["$scope","$resource","$location","$routeParams","UserInfoService","VersionService",function(e,t,n,i,o,r){e.version=r.version,e.token=i.token,e.user=o.user}]);var catene=[];collettaApp.controller("SupermercatiCtrl",["$scope","$q","$resource","$location","$routeParams","GetInfoFactory","SetInfoFactory","SupermercatiService","ComuniService","CateneService","CapiEquipeService","AdminPagesService","CaricoService","VersionService","CollettaService",function(e,t,n,i,o,r,a,s,c,l,u,h,p,d,f){h.section="supermercati",e.version=d.version,e.supermercati=s.supermercati=[],e.colletta=f.colletta,e.collettaPromise=f.collettaPromise,e.checkedAll=0,e.columns=[],e.getComuneById=getComuneById,e.chosenSuperm=2,e.provincie=[],e.comuni=c.comuni,e.catene=l.catene,e.capi_equipe=u.capi_equipe,e.capi_equipe_supermercati=u.capi_equipe_supermercati,e.pagination={page:1,itemsPerPage:50,currentPage:function(){return e.pagination.page*e.pagination.itemsPerPage}},e.search={visible:!0,provincia:"",comune:"",catena:""},e.capi_equipe_deferred=t.defer(),e.capi_equipe_promise=e.capi_equipe_deferred.promise,e.capi_equipe_supermercati_deferred=t.defer(),e.capi_equipe_supermercati_promise=e.capi_equipe_supermercati_deferred.promise,e.getComuni=function(){if(0==e.comuni.length){var t=new r;t.$save({token:o.token,property:"comuni"},function(){e.comuni=t.comuni,e.provincie=_.uniq(e.comuni.map(function(e){return{id:e.id_provincia,nome:e.provincia}}),"id"),c.def.resolve()})}},e.getCatene=function(){if(0==e.catene.length){var t=new r;t.$save({token:o.token,property:"catene"},function(){e.catene=t.catene,l.def.resolve(),catene=e.catene})}},e.stuffs=[{name:"thing1",desc:"this is the first thing"},{name:"thing2",desc:"this is the second thing"}],e.getCapiEquipe=function(){var t=new r;t.$save({token:o.token,property:"capi_equipe"},function(){for(var n=0;t.capi_equipe.length>n;n++)e.capi_equipe[t.capi_equipe[n].id]=$.extend({supermercati:[]},t.capi_equipe[n]);e.capi_equipe_deferred.resolve()})},e.getCapiEquipeSupermercati=function(){var t=new r;t.$save({token:o.token,property:"capi_equipe_supermercati"},function(){e.capi_equipe_supermercati=t.capi_equipe_supermercati,e.capi_equipe_supermercati_deferred.resolve()})},e.getSupermercati=function(){var t={};null!=e.search.comune&&""!=e.search.comune&&(t.id_comune=e.search.comune),null!=e.search.provincia&&""!=e.search.provincia&&(t.id_provincia=e.search.provincia),null!=e.search.catena&&""!=e.search.catena&&(t.id_catena=e.search.catena),t.id_colletta=e.colletta.filter(function(e){return 1==e.attiva})[0].id;var n=new r(t);n.$save({token:o.token,property:"supermercati"},function(){e.supermercati.length=0;for(var t=0;e.capi_equipe_supermercati.length>t;t++){var i=e.capi_equipe_supermercati[t];e.capi_equipe[i.id_capo_equipe].supermercati.push(i.id_supermercato)}for(var t in n.supermercati){n.supermercati[t].catena=e.catene.filter(function(e){return e.id==n.supermercati[t].id_catena}).map(function(e){return e.nome})[0],n.supermercati[t].comune=e.comuni.filter(function(e){return e.id==n.supermercati[t].id_comune}).map(function(e){return e.nome})[0],n.supermercati[t].provincia=e.comuni.filter(function(e){return e.id==n.supermercati[t].id_comune}).map(function(e){return e.provincia})[0],n.supermercati[t].capi_equipe=[];for(var o in e.capi_equipe)-1!=e.capi_equipe[o].supermercati.indexOf(n.supermercati[t].id)&&n.supermercati[t].capi_equipe.push(e.capi_equipe[o]);e.supermercati.push(s.supermercato(n.supermercati[t]))}e.chosenSuperm=e.supermercati[0].id,e.search.visible=!1})},e.setToggledSupermercati=function(t){var n=new a({values:[{id_supermercato:{IN:e.getAllSupermercatiIds({checked:1})}}],set:[{confermato:t}]});n.$save({token:o.token,property:"supermercati"},function(){})},e.$on("id",function(){e.getSupermercati(o.idSupermercato)}),e.$on("comuni",function(){e.getComuni()}),e.$on("catene",function(){e.getCatene()}),e.$on("capi_equipe",function(){e.getCapiEquipe(),e.getCapiEquipeSupermercati()}),t.all([e.capi_equipe_promise,e.capi_equipe_supermercati_promise,e.collettaPromise,c.prom,l.prom]).then(function(){e.getSupermercati()}),void 0!==o.idSupermercato&&e.$emit("id"),e.$emit("comuni"),e.$emit("catene"),e.$emit("capi_equipe"),e.openDetails=function(t){localStorage.supermercato=JSON.stringify(e.supermercati.filter(function(e){return e.id==t})[0]),i.path("/"+o.token+"/prodotti/"+t)},e.getAllSupermercatiIds=function(t){for(var n=[],i=0;e.supermercati.length>i;i++)if("undefined"!=t){var o=!0;for(var r in t)if(e.supermercati[i][r]!=t[r]){o=!1;break}o&&n.push(e.supermercati[i].id)}else n.push(e.supermercati[i].id);return n},e.filterFirst={initSelection:function(e,t){t($(e).data("$ngModelController").$modelValue)}},e.toggleSelected=function(){},e.enableChecked=function(){},e.disableChecked=function(){},e.incrementPagination=function(){e.supermercati.length>e.pagination.currentPage()&&e.pagination.page++}}]),collettaApp.filter("range",function(){return function(e,t,n){var i=[];if(void 0!==e){t=parseInt(t),n=parseInt(n);for(var o=t;n>o;o++)e.length>o&&i.push(e[o])}return i}});var prodotti=[];collettaApp.controller("ProdottiCtrl",["$scope","$resource","$location","$modal","$routeParams","GetInfoFactory","InsertInfoFactory","SetInfoFactory","ComuniService","CateneService","CapiEquipeService","CaricoService","VersionService",function(e,t,n,i,o,r,a,s,c,l,u,h,p){function d(){var t=e.caricoTmpl.map(function(e){return $.extend({},{id_supermercato:o.idSupermercato,id_user:"",prodotto:"'"+e.prodotto+"'",kg:e.kg,scatole:e.scatole,carico:parseInt(h.lastId)+1})}),n=new a({values:t});n.$save({token:o.token,property:"prodotti"},function(){e.$emit("refresh")})}function f(){var t=[],n=[];e.caricoTmpl.map(function(e){t.push(e),n.push({id:e.id})});var i=new s({values:t,set:n});i.$save({token:o.token,property:"prodotti"},function(){e.$emit("refresh")})}e.version=p.version,e.view=1,e.supermercato=null,e.prodottiNomi=h.prodottiNomi,e.caricoTmpl=h.caricoTmpl,e.prodotti=[],e.prodottiByTipo=[],e.prodottiCarichi={},e.prodottiLength=0,e.lastCarico=1,e.getSupermercatoById=function(){e.supermercato=$.parseJSON(localStorage.supermercato)},e.getCarichiByIdSupermercato=function(){var t=new r({id_supermercato:o.idSupermercato});t.$save({token:o.token,property:"prodotti"},function(){if(void 0!==t.prodotti){e.prodotti.length=0,t.prodotti.map(function(e){return $.extend(e,{carico:parseInt(e.carico),kg:e.kg,scatole:parseInt(e.scatole)})});var n=_.groupBy(t.prodotti,function(e){return parseInt(e.carico)});e.prodottiByTipo=_.groupBy(t.prodotti,function(e){return e.prodotto});for(var i in n)e.prodotti.push({order:parseInt(i),objects:n[i]});e.prodottiLength=e.prodotti.length,h.lastId=e.prodottiLength>0?e.prodotti[e.prodotti.length-1].objects[0].carico:0}})},e.$on("refresh",function(){e.getCarichiByIdSupermercato(),e.getSupermercatoById()}),e.$emit("refresh"),e.isNaN=isNaN,e.parseInt=parseInt,e.openNewCarico=function(){h.modalTitle="Nuovo Carico",e.caricoTmpl.map(function(e,t){return $.extend(e,h.newCarico[t])});var t=i.open({templateUrl:"myModalContent.html",controller:CaricoCtrl,resolve:{}});t.result.then(function(){d()},function(){})},e.openSetCarico=function(t){h.modalTitle="Modifica Carico",e.caricoTmpl.map(function(e,n){return $.extend(e,t[n])});var n=i.open({templateUrl:"myModalContent.html",controller:CaricoCtrl,resolve:{}});n.result.then(function(){f()},function(){})}}]);var prodotti=[],CaricoCtrl=function(e,t,n,i,o,r,a,s){e.version=s.version,e.columns=r.prodottiNomi,e.carico=r.caricoTmpl,e.lastId=r.lastId,e.modalTitle=r.modalTitle,e.ok=function(){a.close()},e.cancel=function(){a.dismiss("cancel")}};CaricoCtrl.$inject=["$scope","$resource","$location","$routeParams","GetInfoFactory","CaricoService","$modalInstance","VersionService"],collettaApp.controller("CateneCtrl",["$scope","$resource","$location","$routeParams","GetInfoFactory","CaricoService","VersionService",function(e,t,n,i,o,r,a){e.version=a.version}]),collettaApp.controller("FilesCtrl",["$scope","$resource","$location","$routeParams","ServerAddress","SetInfoFactory","UserInfoService","VersionService","filesUpload","CollettaService",function(e,t,n,i,o,r,a,s,c,l){e.version=s.version,e.token=i.token,e.colletta=l.colletta,e.colletta_active=l.active,e.uploaded=1,e.files=l.files,e.progress=0,e.collettaPromise=l.collettaPromise,e.collettaPromise.then(function(){e.colletta_active=e.colletta.filter(function(e){return"1"==e.attiva})[0];var t=c.get({year:e.colletta_active.anno},function(){e.files.length=0;for(var n in t.files[e.colletta_active.anno])e.files.push({name:n,checked:t.files[e.colletta_active.anno][n].checked,status:t.files[e.colletta_active.anno][n].checked?1:0}),t.files[e.colletta_active.anno][n].checked||(e.uploaded=0)})}),e.getChecked=function(){for(var t=!0,n=0;e.files.length>n;n++)0==e.files[n].status&&(t=!1);return t},e.updateInfo=function(){var n=t(o.getServerAddress()+"/:token/info/update/:year",{token:i.token,year:e.colletta_active.anno}),r=n.get(function(){void 0!==r.result})},e.changeCollettaActive=function(t){for(var n=[],o=[],a=0;e.colletta.length>a;a++)e.colletta[a].attiva=e.colletta[a].anno==t.anno?!0:!1,n.push(e.colletta[a]),o.push({id:e.colletta[a].id});var s=new r({values:n,set:o});s.$save({token:i.token,property:"colletta"},function(){})}}]),collettaApp.directive("myUploader",["$routeParams","ServerAddress","CollettaService",function(){return{link:function(e,t){$(t).find(".fake-uploader").on("click",function(){$(this).parent().find('input[type="file"]').trigger("click")}),$(t).find(".fake-uploader").on("dragover",function(e){e.preventDefault(),e.stopPropagation()}),$(t).find(".fake-uploader").on("dragenter",function(e){e.preventDefault(),e.stopPropagation()}),$(t).find(".fake-uploader").on("drop",function(e){e.originalEvent.dataTransfer&&e.originalEvent.dataTransfer.files.length&&(e.preventDefault(),e.stopPropagation(),$(this).parent().children("input[type='file']").prop("files",e.originalEvent.dataTransfer.files))}),$(t).find('input[type="file"]').on("change",function(){e.$parent.$apply(function(){e.$parent.uploaded=!1}),$(t).find(".status-2").show(),e.$apply(function(){e.file.status=2})})}}}]),collettaApp.directive("myUpload",["$routeParams","ServerAddress","CollettaService",function(e,t,n){return{link:function(i,o){$(o).find("button").on("click",function(){var o=!0,r=$(this).parents("form");$.each(r.find("input[type='file']"),function(e,t){return""!=$(t).val()?(o=!1,!1):void 0}),r.attr("action",t.getServerAddress()+"/"+e.token+"/files/"+n.active.anno),o?i.uploaded&&i.updateInfo():r.ajaxSubmit({type:"POST",uploadProgress:function(e,t,n,o){i.$apply(function(){i.progress=o})},error:function(e,t,n,i){i.removeAttr("action")},success:function(e){var t=$.parseJSON(e);if(void 0!==t.files){i.$apply(function(){i.files.length=0});for(var n in t.files[i.colletta_active.anno])i.$apply(function(){i.files.push({name:n,checked:t.files[i.colletta_active.anno][n].checked})})}i.$apply(function(){i.uploaded=!0}),i.updateInfo()}})})}}}]),collettaApp.factory("filesUpload",["$resource","$routeParams","ServerAddress",function(e,t,n){var i=e(n.getServerAddress()+"/:token/files/:year",{token:t.token,year:"@year"});return i}]),collettaApp.service("CollettaService",["$q",function(e){var t=e.defer();return{collettaDeferred:t,collettaPromise:t.promise,colletta:[],active:"",files:[]}}]),collettaApp.service("ComuniService",["$q",function(e){var t=e.defer();return{def:t,prom:t.promise,comuni:[]}}]),collettaApp.service("CateneService",["$q",function(e){var t=e.defer();return{def:t,prom:t.promise,catene:[]}}]),collettaApp.service("CapiEquipeService",["$q",function(e){var t=e.defer();return{def:t,prom:t.promise,capi_equipe:{},capi_equipe_supermercati:{}}}]),collettaApp.service("UserInfoService",["$q",function(e){function t(e){return $.extend({},{nome:null,cognome:null,email:null,privilegi:null,ruolo:null,telefono:null,username:null,pages:[]},e)}var n=e.defer();return{def:n,prom:n.promise,user:{nome:null,cognome:null,email:null,privilegi:null,ruolo:null,telefono:null,username:null,pages:[]},userObj:function(e){return new t(e)}}}]);