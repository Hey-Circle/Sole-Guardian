(function() {

    var app = angular.module('soleGuardian', []);
    app.controller('ResourceController', ['$scope', function($scope) {
            $scope.salary = 1000;
            
            $scope.dateTime = new Date(1993, 8,25, 8,30).getTime();
            var timeRate = 50;
            var endTime = 0;
            $scope.working = false;

            $scope.money = 1000;
            $scope.location = 0;


            this.workTime = function(timeElapsed) {
                endTime = $scope.dateTime + timeElapsed;
                timeRate = 100000;
                $scope.working = true;
                
            };
            
            this.changeLocation = function(newLocation) {
                $scope.location = newLocation;
            }
            
            this.isLocation = function(testLocation) {
                return testLocation === $scope.location;
            }

            function step() {
                $scope.$apply(function() {
                    if($scope.working && endTime < $scope.dateTime){
                        $scope.working  = false;
                        timeRate = 50;
                    }
                    $scope.dateTime += timeRate;

                })
            }

            var timer = setInterval(step, 20);
            
            
        }]);
    
    
})();

