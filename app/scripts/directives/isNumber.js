collettaApp.directive('isNumber', function () {
    return {
        link: function (scope) {
            console.log(scope.pr)
            scope.$watch('pr.scatole', function(newValue,oldValue) {
                var arr = String(newValue).split("");
                if (arr.length === 0) return;
                if (arr.length === 1 && (arr[0] == '-' || arr[0] === '.' )) return;
                if (arr.length === 2 && newValue === '-.') return;
                if (isNaN(newValue)) {
                    scope.pr.scatole = oldValue;
                }
            });
            scope.$watch('pr.kg', function(newValue,oldValue) {
                var arr = String(newValue).split("");
                if (arr.length === 0) return;
                if (arr.length === 1 && (arr[0] == '-' || arr[0] === '.' )) return;
                if (arr.length === 2 && newValue === '-.') return;
                if (isNaN(newValue)) {
                    scope.pr.kg = oldValue;
                }
            });
        }
    };
});