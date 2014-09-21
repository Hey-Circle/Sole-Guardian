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
            $scope.biWeeklyAccumulation = 0;
            $scope.nextPayDate = $scope.dateTime + 14*24*60*60*1000;
            
            $scope.rent = 1000;
            $scope.rentDueDate = new Date(1993, 9, 6, 20, 0);

            this.workTime = function(hours) {
                var timeElapsed = hours * 60 * 60 * 1000;
                endTime = $scope.dateTime + timeElapsed;

                timeRate = 5000000;
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
            
            var addToDueEarnings = function() {
                if($scope.workingShiftLength <= 8) {
                    $scope.biWeeklyAccumulation = $scope.biWeeklyAccumulation + $scope.workingShiftLength*$scope.wages;
                } else {
                    $scope.biWeeklyAccumulation = $scope.biWeeklyAccumulation + 8*$scope.wages + 4*$scope.wages*1.5;
                }
            };

            /*
             * Methid that keeps track of time the game
             * and runs the engine
             */
            function step() {
                $scope.$apply(function() {
                    //check if you reach payday
                    if($scope.dateTime >= $scope.nextPayDate) {
                        $scope.money += $scope.biWeeklyAccumulation;                        
                        $scope.msgs.push("You have been paid $" + $scope.biWeeklyAccumulation);
                        $scope.biWeeklyAccumulation = 0;
                        $scope.nextPayDate += 14*24*60*60*1000;
                    }
                    //check if you reach rent paytime
                    if($scope.dateTime >= $scope.rentDueDate) {
                        alert("rent due");
                        $scope.money -= $scope.rent;
                        $scope.msgs.push("You just paid your rent for this month.");
                        //set new rent due date
                        var rentDueMonth = (new Date($scope.dateTime).getMonth())%12 + 1;
                        var rentDueYear = (new Date($scope.dateTime).getFullYear());
                        if (rentDueMonth === 1) {
                            rentDueYear++;
                        }
                        $scope.rentDueDate = new Date(rentDueYear, rentDueMonth, 6, 20, 0).getTime();
                    }
                    if($scope.working && endTime < $scope.dateTime){
                        $scope.working  = false;
                        addToDueEarnings();
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

