myApp.controller('LoginController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.user = {
      username: '',
      password: ''
      //passport by default is expecting these set variable names by convention
      //also connected to the schema
    };
    $scope.message = '';
    //part that displays if you type in incorrect information!

    $scope.login = function() {
      if($scope.user.username == '' || $scope.user.password == '') {
        $scope.message = "Enter your username and password!";
      } else {
        console.log('sending to server...', $scope.user);
        $http.post('/', $scope.user).then(function(response) {
          if(response.data.username) {
            console.log('success: ', response.data);
            // location works with SPA (ng-route)
            console.log('redirecting to user page');
            $location.path('/user');
            //client side redirection to /user angular route
          } else {
            console.log('failure: ', response);
            $scope.message = "Wrong!!";
          }
        });
      }
    }

    $scope.registerUser = function() {
      if($scope.user.username == '' || $scope.user.password == '') {
        $scope.message = "Choose a username and password!";
      } else {
        console.log('sending to server...', $scope.user);
        $http.post('/register', $scope.user).then(function(response) {
          //.then do this stuff when you get a response back
          //we can send back two parameters
          console.log('success');
          $location.path('/home');
        },
        function(response) {
          //remember to pass in same parameter as the initial response
          console.log('error');
          $scope.message = "Please try again."
          //indirect conditional", based on the protocol and handles the http status it forks the Logic
          //it will do one or the other based on the response protocol. (err or success)
        });
      }
    }
}]);
