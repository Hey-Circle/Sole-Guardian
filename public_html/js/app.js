(function() {

    var app = angular.module('soleGuardian', []);
    app.controller('ResourceController', ['$scope', function($scope) {
            $scope.salary = 1000;
            $scope.dateTime = 946702800000;

            this.elapseTime = function(timeElapsed) {
                $scope.dateTime += timeElapsed;
            };

            function step() {
                $scope.$apply(function() {
                    $scope.dateTime += 50;
                })
            }

            var timer = setInterval(step, 20);
        }]);
})();

