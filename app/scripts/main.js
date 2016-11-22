'use strict';
var versionTmpl= '1.9';

var collettaApp= angular.module('collettaApp', ['ngResource','ngRoute','ui.bootstrap','ui.select2']);

collettaApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl:'views/login.html?version='+versionTmpl
        })
        .when('/:token/home', {
            templateUrl:'views/home.html?version='+versionTmpl
        })
        .when('/:token/gestione_supermercati', {
            templateUrl:'views/admin/supermercati.html?version='+versionTmpl
        })
        .when('/:token/gestione_utenti', {
            templateUrl:'views/admin/utenti.html?version='+versionTmpl
        })
        .when('/:token/gestione_magazzini', {
            templateUrl:'views/admin/magazzini.html?version='+versionTmpl
        })
        .when('/:token/gestione_catene', {
            templateUrl:'views/admin/catene.html?version='+versionTmpl
        })
        .when('/:token/gestione_files', {
            templateUrl:'views/admin/files.html?version='+versionTmpl
        })
        .when('/:token/gestione_report', {
            templateUrl:'views/user/report.html?version='+versionTmpl
        })
        .when('/:token/grafici', {
            templateUrl:'views/user/grafici.html?version='+versionTmpl
        })
        .when('/:token/supermercati', {
            templateUrl:'views/user/supermercati.html?version='+versionTmpl
        })
        .when('/:token/prodotti/:idSupermercato', {
            templateUrl:'views/user/prodotti.html?version='+versionTmpl
        })
        .when('/:token/supermercato/:idSupermercato', {
            templateUrl:'views/user/supermercato.html?version='+versionTmpl
        })
        .when('/:token/supermercato/nuovo', {
            templateUrl:'views/user/supermercato.html?version='+versionTmpl
        })
        .when('/:token/capi_equipe', {
            templateUrl:'views/user/capi_equipe.html?version='+versionTmpl
        })
        .otherwise({redirectTo:'/'});
}]);
