(function() {

    var app = angular.module('soleGuardian', []);

    //Filter to reverse an array
    app.filter('reverse', function() {
        return function(items) {
            return items.slice().reverse();
        };
    });

    app.filter('staminaFilter', function() {
        return function(items) {
            if (items < 1) {
                return "Exhausted";
            }
            else if (items < 4) {
                return "Tired";
            }
            else if (items < 7) {
                return "Content";
            }
            else {
                return "Energetic";
            }
        };
    });

    app.filter('pantryFilter', function() {
        return function(items) {
            if (items > 0) {
                return "Stocked";
            }
            else {
                return "Empty";
            }
        };
    });

    app.controller('ResourceController', ['$scope', function($scope) {
            //Player Stats
            $scope.salary = 1000;
            $scope.money = 1000;
            $scope.stamina = 10;
            $scope.health = 8;
            $scope.location = 0;
            $scope.wages = 7.25;
            $scope.biWeeklyAccumulation = 0;


            //Child Stats
            $scope.childName = "Dawn";
            $scope.childAge = 5;
            $scope.childRelationship = 5;
            $scope.childHunger = 0;
            $scope.childHealth = 7;
            var playedWith = false;

            //Groceries available to cook (1 is stocked, 0 is no stock)
            $scope.groceries = 0;

            //Notifications
            $scope.msgs = [];

            //September 25, 1993
            $scope.dateTime = new Date(1988, 8, 25, 8, 00).getTime();

            //How fast a game second goes
            var timeRate = 50;

            //Used for timekeeping
            var endTime = 0;

   //Character working on a task i.e. travel, shopping, work, sleeping
   //flag variables
            $scope.working = false;
            //Character is sleeping
            $scope.sleeping = false;
            $scope.wentToWork = false;
            $scope.workingShiftLength = 0;


            $scope.nextPayDate = $scope.dateTime + 14 * 24 * 60 * 60 * 1000;

            $scope.rent = 1000;
            $scope.rentDueDate = new Date(1988, 9, 6, 20, 0);
            
            var timeElapsed = 0;
            var second = 1000;
            var minute = 60 * second;
            var hour = 60 * minute;

            //Keeps track of time character went to sleep.
            $scope.bedTime = 0;


            //Play with child
            this.playWithChild = function() {
                this.elapsedHours(1);
                if ($scope.childRelationship >= 5) {
                    $scope.msgs.push("You played with your child for an hour. She seems more happy and content");
                }
                else if ($scope.childRelationship < 5) {
                    $scope.msgs.push("You played with your child for an hour. She seems less detached");
                }


                $scope.childRelationship += 0.2;
                $scope.stamina -= 1;
                playedWithed = true;
            }

            //Time to eat
            this.eatTime = function(minutes) {
                this.elapsedMinutes(minutes);
                $scope.childHunger = 0;
                if (minutes === 10) {
                    $scope.childHealth -= .05;
                    $scope.money -= 10;
                    $scope.msgs.push("You just ate fast food with your child.");

                }
                if (minutes === 60) {
                    $scope.childHealth += .02;
                    $scope.stamina -= 1;
                    $scope.childRelationship += 0.1;
                    $scope.groceries = 0;
                    $scope.msgs.push("You just prepared and ate a nutritious home-cooked meal with your child.");
                }
                if (minutes === 90) {
                    $scope.childHealth += .03;
                    $scope.money -= 50;
                    $scope.msgs.push("You just ate a nutritious meal at a gourmet restaurant with your child.");
                }
            }
            //Time to shop for groceries
            this.shopTime = function(minutes) {
                this.elapsedMinutes(minutes);
                $scope.groceries = 1;
                $scope.money -= 15;
                $scope.stamina -= .5;
                $scope.msgs.push("You just went shopping for groceries. Your pantry is stocked to make a meal");
            }

            this.homeTravelFromFood = function() {
                this.elapsedMinutes(10);
                $scope.msgs.push("You have traveled for " + 10 + " minutes.");
                this.changeLocation(0);
            }

            //Travel time to go Home from work (pick up kid on the way)
            this.homeTravel = function() {
                var pickupTime = $scope.dateTime;
                pickupTime = new Date(pickupTime);
                var minDifference = ((pickupTime.getHours() * 60) + pickupTime.getMinutes()) - ((16 * 60) + 30);
                this.elapsedMinutes(30);
                $scope.msgs.push("You have traveled for " + 30 + " minutes.");
                if (minDifference <= 0) {
                    $scope.msgs.push("You picked your child on time.");
                }
                else {
                    $scope.msgs.push("You were " + minDifference + " minutes late to pick up your child.");
                    $scope.childRelationship -= ((minDifference / 60) * .1);
                }
                this.changeLocation(0);
            }

            //Travel timem to go to Work
            this.workTravel = function() {
                this.elapsedMinutes(30);
                $scope.msgs.push("You have traveled for " + 30 + " minutes.");
                this.changeLocation(1);
                $scope.wentToWork = true;
                
                //Child eats breakfast at school
                $scope.childHunger = 0;
            }

            this.foodTravel = function() {
                this.elapsedMinutes(10);
                $scope.msgs.push("You have traveled for " + 10 + " minutes.");
                this.changeLocation(2);
            }

            //Time spent working
            this.workTime = function(hours) {
                this.elapsedHours(hours);
                $scope.stamina = $scope.stamina - (hours * .8);
                $scope.workingShiftLength = hours;
                $scope.msgs.push("You have worked for " + hours + " hours.");

            };

            //Time spent sleeping and other actions
            this.sleepTime = function() {
                $scope.sleeping = true;
                $scope.bedTime = $scope.dateTime;

                var currDate = new Date($scope.dateTime);
                var timePlannedToSleep;
                if (currDate.getHours() < 8) {
                    timePlannedToSleep = 8 - currDate.getHours();
                }
                else {
                    timePlannedToSleep = 8 + (23 - currDate.getHours());
                }
                this.elapsedHours(timePlannedToSleep);
                //Work around for testing relationship
                if (playedWith == false) {
                    $scope.childRelationship -= 0.3;
                }

                if ($scope.childHunger > 6){
                    $scope.msgs.push("Your child went to sleep hungry today.")
                }
                playedWith = false;
                $scope.wentToWork = false;
            }

            //method  to pass certain amount of hours
            this.elapsedHours = function(hours) {
                var timeElapsed = hours * 60 * 60 * 1000;
                endTime = $scope.dateTime + timeElapsed;
                $scope.working = true;
                timeRate = 1000000;
            }

            //method  to pass certain amount of minutes     
            this.elapsedMinutes = function(minutes) {
                var timeElapsed = minutes * 60 * 1000;
                endTime = $scope.dateTime + timeElapsed;
                $scope.working = true;
                timeRate = 100000;
            }

            //Used to go to a different room
            this.changeLocation = function(newLocation) {
                $scope.location = newLocation;
            }

            this.isLocation = function(testLocation) {
                return testLocation === $scope.location;
            }

            var addToDueEarnings = function() {
                if ($scope.workingShiftLength <= 8) {
                    $scope.biWeeklyAccumulation = $scope.biWeeklyAccumulation + $scope.workingShiftLength * $scope.wages;
                } else {
                    $scope.biWeeklyAccumulation = $scope.biWeeklyAccumulation + 8 * $scope.wages + 4 * $scope.wages * 1.5;
                }
            };
            
            //controls waking up
            $scope.wakeUp = function() {
                var timeSlept = Math.round((new Date($scope.dateTime).getTime() - $scope.bedTime)/(1000*60*60));
                $scope.msgs.push("You slept " + timeSlept + " hours.");
                if (timeSlept > 6) {
                    $scope.stamina = 10;
                }
                else {
                    $scope.stamina += timeSlept/2;
                    if($scope.stamina > 10) {
                        $scope.stamina = 10;
                    }
                }

                $scope.sleeping = false;
            };
            /*
             * Methid that keeps track of time the game
             * and runs the engine
             */
            function step() {
                $scope.$apply(function() {
                    // 1% chance of child waking you
                    var rand = Math.floor((Math.random() * $scope.childRelationship*50) + 1);
                    if (rand === 1) {
                        if($scope.sleeping) {
                            if($scope.childRelationship < 4.5) {
                                $scope.msgs.push("Your child is lonely and woke you for comfort.");
                                $scope.wakeUp();
                                $scope.working = false;
                                timeRate = 50;
                            }
                        }
                    }
                    //check if you reach payday
                    if ($scope.dateTime >= $scope.nextPayDate) {
                        $scope.money += $scope.biWeeklyAccumulation;
                        $scope.msgs.push("You have been paid $" + $scope.biWeeklyAccumulation);
                        $scope.biWeeklyAccumulation = 0;
                        $scope.nextPayDate += 14 * 24 * 60 * 60 * 1000;
                    }
                    //check if you reach rent paytime
                    if ($scope.dateTime >= $scope.rentDueDate) {
                        $scope.money -= $scope.rent;
                        $scope.msgs.push("You just paid your rent for this month.");
                        //set new rent due date
                        var rentDueMonth = (new Date($scope.dateTime).getMonth()) % 12 + 1;
                        var rentDueYear = (new Date($scope.dateTime).getFullYear());
                        if (rentDueMonth === 1) {
                            rentDueYear++;
                        }
                        $scope.rentDueDate = new Date(rentDueYear, rentDueMonth, 6, 20, 0).getTime();
                    }
                    if ($scope.working && endTime < $scope.dateTime) {
                        $scope.working = false;
                        if ($scope.workingShiftLength > 0) {
                            addToDueEarnings();
                            $scope.workingShiftLength = 0;
                        }
                        if ($scope.sleeping) {
                            
                            $scope.wakeUp();
                        }
                        timeRate = 50;
                    }
                    $scope.dateTime += timeRate;
                    if ($scope.msgs.length > 14) {
                        $scope.msgs.shift()
                    }

                    //change background image for time of day
                    var currDate = new Date($scope.dateTime);
                    if (currDate.getHours() < 8) {
                        //Style for backgroud image
                        $scope.backgroundImageStyle = {
                            background: 'url(images/night.jpg) no-repeat center center fixed '
                        };
                    }
                    else if (currDate.getHours() < 16) {
                        //Style for backgroud image
                        $scope.backgroundImageStyle = {
                            background: 'url(images/day.jpg) no-repeat center center fixed '
                        };
                    }
                    else {
                        //Style for backgroud image
                        $scope.backgroundImageStyle = {
                            background: 'url(images/dusk.jpg) no-repeat center center fixed '
                        };
                    }

                    //Track increases hunger per hour
                    //Can be expanding to track anything per hour
                    if (currDate.getHours() > 14 && !$scope.sleeping) {
                        console.log("Current Time past 2");
                        console.log("Time Elapsed " + timeElapsed);
                        console.log(hour);
                        if (timeElapsed >= hour) {
                            $scope.childHunger += 1;
                            timeElapsed -= hour;
                            if ($scope.chilHunger > 9) {
                                $scope.msgs.push("Your child is suffering from starvation");
                                $scope.childRelationship -= 2;
                            }
                            else if ($scope.childHunger > 6) {
                                $scope.msgs.push("Your child is starving");
                                $scope.childRelationship -= 0.7;
                            }
                            else if ($scope.childHunger > 3) {
                                $scope.msgs.push("Your child is getting hungry");
                            }
                        }
                        //Counter to keep track of time elapsed to be used
                        //in hourly checking
                        timeElapsed += timeRate;
                    }
                    //game-over checking
                    if($scope.money < 0){
                        if(!alert('Game Over! You have no money left. Press OK to restart.')){window.location.reload();}
                    }
                    if($scope.childRelationship < 0){
                        if(!alert('Game Over! Your child was removed by protective services for parent negligence. Press OK to restart.')){window.location.reload();}
                    }

                });
            }

            var timer = setInterval(step, 20);

            //for styling notifications
            this.setOpacity = function(divisor) {
                var opLevel = "" + (4.0 / divisor);
                return {opacity: opLevel};
            }

            //Style for backgroud image
            $scope.backgroundImageStyle = {
                background: 'url(images/day.jpg) no-repeat center center fixed '
            };

        }]);
})();

