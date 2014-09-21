(function() {

    var app = angular.module('soleGuardian', []);
    app.filter('reverse', function() {
        return function(items) {
            return items.slice().reverse();
        };
    });
    app.controller('ResourceController', ['$scope', function($scope) {
            $scope.salary = 1000;
            $scope.msgs = [];



            $scope.dateTime = new Date(1993, 8, 25, 8, 30).getTime();
            var timeRate = 50;
            var endTime = 0;
            $scope.working = false;
            $scope.workingShiftLength = 0;

            $scope.money = 1000;
            $scope.location = 0;
            
            $scope.wages = 7.25;


            this.workTime = function(hours) {
                var timeElapsed = hours * 60 * 60 * 1000;
                endTime = $scope.dateTime + timeElapsed;

                timeRate = 300000;
                $scope.workingShiftLength = hours;

                $scope.working = true;
                $scope.msgs.push("You have worked " + hours + " hours.");

            };

            this.changeLocation = function(newLocation) {
                $scope.location = newLocation;
            }

            this.isLocation = function(testLocation) {
                return testLocation === $scope.location;
            }
            
            var payForWork = function() {
                if($scope.workingShiftLength <= 8) {
                    $scope.money = $scope.money + $scope.workingShiftLength*$scope.wages;
                } else {
                    $scope.money = $scope.money + 8*$scope.wages + 4*$scope.wages*1.5;
                }
            };

            /*
             * Methid that keeps track of time the game
             * and runs the engine
             */
            function step() {
                $scope.$apply(function() {

                    if($scope.working && endTime < $scope.dateTime){
                        $scope.working  = false;
                        payForWork();
                        timeRate = 50;
                    }
                    $scope.dateTime += timeRate;
                    if ($scope.msgs.length > 14) {
                        $scope.msgs.shift()
                    }
                })
            }

            var timer = setInterval(step, 20);

            this.setOpacity = function(divisor){
                var opLevel = "" + (4.0/divisor);
                return {opacity : opLevel};
            }
            
        }]);


})();

