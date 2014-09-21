(function() {

    var app = angular.module('soleGuardian', []);
    app.filter('reverse', function() {
        return function(items) {
            return items.slice().reverse();
        };
    });
    app.controller('ResourceController', ['$scope', function($scope) {
            //Player Stats
            $scope.salary = 1000;
            $scope.money = 1000;
            $scope.health = 0;
            $scope.location = 0;
            $scope.wages = 7.25;
            $scope.biWeeklyAccumulation = 0;
            
            //Notifications
            $scope.msgs = [];

            //September 25, 1993
            $scope.dateTime = new Date(1993, 8, 25, 8, 30).getTime();
            
            //How fast a game second goes
            var timeRate = 50;
            
            //Used for timekeeping
            var endTime = 0;
            
            //Character working on a task i.e. travel, shopping or work
            $scope.working = false;
            $scope.workingShiftLength = 0;

            
            $scope.nextPayDate = $scope.dateTime + 14*24*60*60*1000;
            
            $scope.rent = 1000;
            $scope.rentDueDate = new Date(1993, 9, 6, 20, 0);

            //Travel time to go Home
            this.homeTravel = function(){
                this.elapsedMinutes(30);
                $scope.msgs.push("You have traveled for " + 30 + " minutes.");
                this.changeLocation(0);
            }
            
            //Travel timem to go to Work
            this.workTravel = function(){
                this.elapsedMinutes(30);
                $scope.msgs.push("You have traveled for " + 30 + " minutes.");
                this.changeLocation(1);
            }
            
            //Time spent working
            this.workTime = function(hours) {
                this.elapsedHours(hours);
                $scope.workingShiftLength = hours;
                $scope.msgs.push("You have worked for " + hours + " hours.");

            };
            
            //Time spent sleeping and other actions
            this.sleepTime = function(){
                var currDate = new Date($scope.dateTime);
                var timeSlept;
                if(currDate.getHours() < 8){
                    timeSlept = 8 - currDate.getHours();
                }
                else{
                    timeSlept = 8 + (23 - currDate.getHours());
                }
                this.elapsedHours(timeSlept);
                if(timeSlept > 6){
                   $scope.msgs.push("You were able to get "+timeSlept+ " hours of sleep. Good Job!"); 
                   $scope.health += 0.5
                }
                else{
                   $scope.health -= 1;
                   $scope.msgs.push("You only got " + timeSlept+ " hours of sleep. That is bad for your health");
                }
            }
            
            //method  to pass certain amount of hours
            this.elapsedHours = function(hours){
                var timeElapsed = hours * 60 * 60 * 1000;
                endTime = $scope.dateTime + timeElapsed;
                $scope.working = true;
                timeRate = 1000000;
            }
            
             //method  to pass certain amount of minutes     
             this.elapsedMinutes = function(minutes){
                var timeElapsed = minutes * 60 * 1000;
                endTime = $scope.dateTime + timeElapsed;
                $scope.working = true;
                timeRate = 100000;
            }

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
                        if($scope.workingShiftLength > 0) {
                            addToDueEarnings();
                            $scope.workingShiftLength = 0;
                        }
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

