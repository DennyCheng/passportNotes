var myApp = angular.module('myApp', ['ngRoute']);
/// Routes ///

//able to do user authenticating before routing (we can do pre routes)
myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/home', {
      templateUrl: '/views/home.html',
      controller: "LoginController"
    })
    .when('/register', {
      templateUrl: '/views/register.html',
      controller: "LoginController"
    })
    .when('/user', {
      templateUrl: '/views/user.html',
      controller: "UserController"
    })
    .otherwise({
      redirectTo: 'home'
    })
}]);
