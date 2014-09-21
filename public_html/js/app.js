(function() {

    var app = angular.module('soleGuardian', []);

    //Filter to reverse an array
    app.filter('reverse', function() {
        return function(items) {
            return items.slice().reverse();
        };
    });

    app.filter('relationshipSmiley' , function() {
        return function(items){
            if (items < 1){
                return "images/emoticons/sad.png"
            }
            else if(items <2){
                return "images/emoticons/distant.png";
            }
            else if(items <3){
                return "images/emoticons/annoyed.png";
            }
            else if(items <5){
                return "images/emoticons/miffed.png";
            }
            else if(items <7){
                return "images/emoticons/content.png";
            }
            else if(items <9){
                return "images/emoticons/happy.png";
            }
            else{
                return "images/emoticons/joyful.png";
            }
        }
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
            $scope.dateTime = new Date(1988, 8, 15, 8, 00).getTime();

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
                    var msg = {message:"You played with your child for an hour. Your child seems happier and more content", type:"notification"};
                    $scope.msgs.push(msg);
                }
                else if ($scope.childRelationship < 5) {
                    var msg = {message:"You played with your child for an hour. Your child seems less detached", type:"notification"};
                    $scope.msgs.push(msg);
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
                    var msg = {message:"You just ate fast food with your child.", type:"warning"};
                    $scope.msgs.push(msg);

                }
                if (minutes === 60) {
                    $scope.childHealth += .02;
                    $scope.stamina -= 1;
                    $scope.childRelationship += 0.1;
                    $scope.groceries = 0;
                    var msg = {message:"You just prepared and ate a nutritious home-cooked meal with your child.", type:"notification"};
                    $scope.msgs.push(msg);
                }
                if (minutes === 90) {
                    $scope.childHealth += .03;
                    $scope.money -= 50;
                    var msg = {message:"You just ate a nutritious meal at a gourmet restaurant with your child.", type:"notification"};
                    $scope.msgs.push(msg);
                }
            }
            //Time to shop for groceries
            this.shopTime = function(minutes) {
                this.elapsedMinutes(minutes);
                $scope.groceries = 1;
                $scope.money -= 15;
                $scope.stamina -= .5;
                var msg = {message:"You just went shopping for groceries. Your pantry is stocked to make a meal", type:"notification"};
                $scope.msgs.push(msg);
            }

            this.homeTravelFromFood = function() {
                this.elapsedMinutes(10);
                var msg = {message:"You have traveled for " + 10 + " minutes.", type:"notification"};
                $scope.msgs.push(msg);
                this.changeLocation(0);
            }

            //Travel time to go Home from work (pick up kid on the way)
            this.homeTravel = function() {
                var pickupTime = $scope.dateTime;
                pickupTime = new Date(pickupTime);
                var minDifference = ((pickupTime.getHours() * 60) + pickupTime.getMinutes()) - ((16 * 60) + 30);
                var rand = Math.floor((Math.random() * 100) + 1);
                if ($scope.stamina < 1) {
                    testNum = 15;
                } else {
                    testNum = 1 * (10 / $scope.stamina);
                }
                if (rand < testNum) {
                    this.collision();
                }
                else {
                    this.elapsedMinutes(30);
                    var msg = {message:"You have traveled for " + 30 + " minutes.", type:"notification"};
                    $scope.msgs.push(msg);
                    if (minDifference <= 0) {
                        var msg = {message:"You picked your child on time.", type:"warning"};
                        $scope.msgs.push(msg);
                    }
                    else {
                        var msg = {message:"You were " + minDifference + " minutes late to pick up your child.", type:"warning"};
                        $scope.msgs.push(msg);
                        $scope.childRelationship -= ((minDifference / 60) * .1);
                    }
                }
                this.changeLocation(0);
            }

            //Travel timem to go to Work
            this.workTravel = function() {
                var rand = Math.floor((Math.random() * 100) + 1);
                if ($scope.stamina < 1) {
                    testNum = 15;
                } else {
                    testNum = 1 * (10 / $scope.stamina);
                }
                if (rand < testNum) {
                    this.collision();
                }
                else {
                    this.elapsedMinutes(30);
                    var msg = {message:"You have traveled for " + 30 + " minutes.", type:"notification"};
                    $scope.msgs.push(msg);
                    this.changeLocation(1);
                    $scope.wentToWork = true;

                    //Child eats breakfast at school
                    $scope.childHunger = 0;
                }
            }

            this.collision = function() {
                var repairFee = Math.floor((Math.random() * 400) + 100);
                var alertMessage = "You have been in an accident due to fatigue. You must stay with the mechanic for\n\
                        the next 6 hours. You must pay a repair fee of $" + repairFee;
                var msg = {message:alertMessage, type:"alert"};
                $scope.msgs.push(msg);
                $scope.money -= repairFee;
                this.elapsedHours(6);


            }

            this.foodTravel = function() {
                this.elapsedMinutes(10);
                var msg = {message:"You have traveled for " + 10 + " minutes.", type:"notification"};
                $scope.msgs.push(msg);
                this.changeLocation(2);
            }

            //Time spent working
            this.workTime = function(hours) {
                this.elapsedHours(hours);
                $scope.stamina = $scope.stamina - (hours * .8);
                $scope.workingShiftLength = hours;
                var msg = {message:"You have worked for " + hours + " hours.", type:"notification"};
                $scope.msgs.push(msg);

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

                if ($scope.childHunger > 6) {
                    var msg = {message:"Your child went to sleep hungry today.", type:"alert"};
                    $scope.msgs.push(msg);
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
                var timeSlept = Math.round((new Date($scope.dateTime).getTime() - $scope.bedTime) / (1000 * 60 * 60));
                var msg = {message:"You slept " + timeSlept + " hours.", type:"notification"};
                $scope.msgs.push(msg);
                if (timeSlept > 6) {
                    $scope.stamina = 10;
                }
                else {
                    $scope.stamina += timeSlept / 2;
                    if ($scope.stamina > 10) {
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
                    var rand = Math.floor((Math.random() * $scope.childRelationship * 50) + 1);
                    if (rand === 1) {
                        if ($scope.sleeping) {
                            if ($scope.childRelationship < 4.5) {
                                var msg = {message:"Your child is lonely and woke you for comfort.", type:"warning"};
                                $scope.msgs.push(msg);
                                $scope.wakeUp();
                                $scope.working = false;
                                timeRate = 50;
                            }
                        }
                    }
                    //check if you reach payday
                    if ($scope.dateTime >= $scope.nextPayDate) {
                        $scope.money += $scope.biWeeklyAccumulation;
                        var msg = {message:"You have been paid $" + $scope.biWeeklyAccumulation, type:"warning"};
                        $scope.msgs.push(msg);
                        $scope.biWeeklyAccumulation = 0;
                        $scope.nextPayDate += 14 * 24 * 60 * 60 * 1000;
                    }
                    //check if you reach rent paytime
                    if ($scope.dateTime >= $scope.rentDueDate) {
                        $scope.money -= $scope.rent;
                        var msg = {message:"You just paid your rent for this month.", type:"warning"};
                        $scope.msgs.push(msg);
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
                    if ($scope.msgs.length > 12) {
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
                        if (timeElapsed >= hour) {
                            $scope.childHunger += 1;
                            timeElapsed -= hour;
                            if ($scope.chilHunger > 9) {
                                var msg = {message:"Your child is suffering from starvation.", type:"alert"};
                                $scope.msgs.push(msg);
                                $scope.childRelationship -= 2;
                            }
                            else if ($scope.childHunger > 6) {
                                var msg = {message:"Your child is starving.", type:"warning"};
                                $scope.msgs.push(msg);
                                $scope.childRelationship -= 0.7;
                            }
                            else if ($scope.childHunger > 3) {
                                var msg = {message:"Your child is getting hungry.", type:"notification"};
                                $scope.msgs.push(msg);
                            }
                        }
                        //Counter to keep track of time elapsed to be used
                        //in hourly checking
                        timeElapsed += timeRate;
                    }
                    //game-over checking
                    if($scope.money < 0){
                        clearInterval(timer);
                        if(!alert('Game Over! You have no money left. Press OK to restart.')){window.location.reload();}
                    }
                    if($scope.childRelationship < 0){
                        clearInterval(timer);
                        if(!alert('Game Over! Your child was removed by protective services for parental negligence. Press OK to restart.')){window.location.reload();}
                    }

                });
            }

            var timer = setInterval(step, 20);

            //for styling notifications
            this.messageStyle = function(divisor, type) {
                var opLevel = "" + (4.0 / divisor);
                var myColor = '#ffffff';
                if(type === 'alert'){
                    myColor = '#fb0909';
                }
                else if(type === 'warning'){
                    myColor = '#fdff00';
                }
                return {
                    opacity: opLevel,
                    color : myColor
                };
            }

            //Style for backgroud image
            $scope.backgroundImageStyle = {
                background: 'url(images/day.jpg) no-repeat center center fixed '
            };

        }]);
})();

