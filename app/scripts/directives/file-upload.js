collettaApp.directive('myUploader', ["$routeParams", "ServerAddress", "CollettaService", function($routeParams,ServerAddress,CollettaService) {
	return {
		link: function(scope, elem, attrs) {
			$(elem).find('.fake-uploader').on('click', function() {
				$(this).parent().find('input[type="file"]').trigger('click');
			});
			$(elem).find('input[type="file"]').on('change', function()
			{
				var form = $(this).parents('form');

				if ($(this).val() == '') {
					return false;
				}
				form.attr('action', ServerAddress.getServerAddress()+"/"+$routeParams.token+"/files/"+CollettaService.active.anno);				

				form.ajaxSubmit({
					type: 'POST',
					uploadProgress: function(event, position, total, percentComplete) {
						scope.$apply(function() {
							// upload the progress bar during the upload
							scope.progress = percentComplete;
						});
					},
					error: function(event, statusText, responseText, form) { 
						// remove the action attribute from the form
						form.removeAttr('action');
					},
					success: function(responseText, statusText, xhr, form) {
						var resp= $.parseJSON(responseText);

						if(typeof resp.files!='undefined')
						{
							scope.$apply(function() {
								scope.files.length=0;
							});
							for (var i in resp.files[scope.colletta_active.anno]) {
								scope.$apply(function() {
									scope.files.push({name: i, checked: resp.files[scope.colletta_active.anno][i].checked});
								});
							};
						}
					},
				});
			});
		}
	};
}]);