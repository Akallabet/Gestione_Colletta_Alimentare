'use strict';

collettaApp.controller('CapiEquipeCtrl', ['$scope', '$q', '$resource', '$location', '$routeParams', 'FeedbackService', 'CapiEquipeService',
function($scope, $q, $resource, $location, $routeParams, FeedbackService, CapiEquipeService)
{
	$scope.generalFeedback= FeedbackService.feedback();
	$scope.generalFeedback.status= 0;

	$scope.feedback= FeedbackService.feedback();
	$scope.feedback.status= 0;

	$scope.generalFeedback.changeStatus(2);

	$scope.capoEquipe= {
		nome: '',
		email: '',
		telefono: ''
	};

	$scope.addCapoEquipe= function()
	{
		$scope.feedback.changeStatus(1);
		CapiEquipeService.addInfo($scope.capoEquipe.info)
			.then(function(){
				$scope.feedback.changeStatus(2);
			},
			function(){
				$scope.feedback.changeStatus(3);
			});
	}
}]);
