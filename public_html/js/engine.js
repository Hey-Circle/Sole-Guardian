var elem = document.getElementById("outer");
var myScope = angular.element(elem).scope();
var timer = setInterval(step, 20);

function step() {
    myScope.salary -= 1;
    if (myScope.salary < 1) {
        clearInterval(timer);
        alert("You have no money");
    }
}


