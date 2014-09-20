(function(){
    
    var app = angular.module('soleGuardian', []);
    
    app.controller('ResourceController', ['$scope', function($scope){
        $scope.salary = 1000;
        $scope.dateTime = 946702800000;
        
        this.elapseTime = function(timeElapsed) {
            $scope.dateTime += timeElapsed;
        };
    }]);
    
    app.controller('TestController', ['$scope', function($scope) {
        $scope.salary -= 200;
    }]);
})();

