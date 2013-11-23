collettaApp.directive('toggleAll', function(){
    return {
        link: function(scope, element, attrs) {
            $(element).on('change', function(){
                $('tbody input[type="checkbox"]').trigger('click');
            });
        }
    }
});