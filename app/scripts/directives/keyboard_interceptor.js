collettaApp.directive('keyboardInterceptor', function(){
    return {
        link: function(scope, element, attrs) {
            $(document).on('keydown', function(e){
            	if(e.keyCode==79 && e.shiftKey && (e.metaKey || e.ctrlKey))
            	{
            		// console.log("yess");
            		scope.$apply(function(){
            			scope.excelMode= !scope.excelMode;
            		});
            	}
            });
        }
    }
});