collettaApp.directive('myUploader', ["$routeParams", "ServerAddress", "CollettaService", function($routeParams,ServerAddress,CollettaService) {
	return {
		link: function(scope, elem, attrs) {
			/*
			console.log(scope.file)
			if(scope.file.checked)
				$(elem).find('.status-0').show();
			else
				$(elem).find('.status-1').show();
			*/
			$(elem).find('.fake-uploader').on('click', function() {
				$(this).parent().find('input[type="file"]').trigger('click');
			});

			$(elem).find('.fake-uploader').on(
			    'dragover',
			    function(e) {
			        e.preventDefault();
			        e.stopPropagation();
			    }
			)
			$(elem).find('.fake-uploader').on(
			    'dragenter',
			    function(e) {
			        e.preventDefault();
			        e.stopPropagation();
			    }
			)
			$(elem).find('.fake-uploader').on(
			    'drop',
			    function(e){
			        if(e.originalEvent.dataTransfer){
			            if(e.originalEvent.dataTransfer.files.length) {
			                e.preventDefault();
			                e.stopPropagation();
			                /*UPLOAD FILES HERE*/
			                $(this).parent().children("input[type='file']").prop('files', e.originalEvent.dataTransfer.files);
			            }   
			        }
			    }
			);
			$(elem).find('input[type="file"]').on('change', function(){
				scope.$parent.$apply(function(){
					scope.$parent.uploaded= false;
				});
				$(elem).find('.status-2').show();
				scope.$apply(function(){
					scope.file.status=2;
				});
			});
		}
	};
}]);

collettaApp.directive('myUpload', ["$routeParams", "ServerAddress", "CollettaService", function($routeParams,ServerAddress,CollettaService) {
	return {
		link: function(scope, elem, attrs) {
			$(elem).find('button').on('click', function(e)
			{
				var notFound= true;
				var form = $(this).parents('form');
				$.each(form.find("input[type='file']"), function(i, inp){
					if($(inp).val()!='')
					{
						notFound= false;
						return false;
					}
				});
				//console.log(notFound)
				form.attr('action', ServerAddress.getServerAddress()+"/"+$routeParams.token+"/files/"+CollettaService.active.anno);				
				if(!notFound)
				{
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
							scope.$apply(function(){
								scope.uploaded= true;
							});
							scope.updateInfo();
						},
					});
				}
				else if(scope.uploaded)
				{
					scope.updateInfo();
				}
			});
		}
	};
}]);