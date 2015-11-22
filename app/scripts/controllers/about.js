'use strict';

/**
 * @ngdoc function
 * @name collettaApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the collettaApp
 */
angular.module('collettaApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
