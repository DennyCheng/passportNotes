myApp.controller('UserController', ['$scope', '$http', '$location', function($scope, $http, $location) {
  // This happens after view/controller loads -- not ideal but it works for now.
  //typically you want a user to be autheticated before we get/load the page
  console.log('checking user');
  $http.get('/user').then(function(response) {
    //as soon as the controller loads it makes a request to the server has access to see this page
    //prevention if someone just types in the URL/ so server is the only one who
    //is authorized is able to see the page. It checks if the person is logged in/authorized
    //by calling the isAuthenticated
    //if we want views only to logged in users (we ask the server on client side)
    //server has to then run req.isAuthenticated()
    //have to have different classes for admin/user
    //makes a get request to /user to make sure the user has access to the page
      if(response.data.username) {
          // user has a curret session on the server
          $scope.userName = response.data.username;
          console.log('User Data: ', $scope.userName);
      } else {
          // user has no session, bounce them back to the login page
          $location.path("/home");
      }
  });

  $scope.logout = function() {
    $http.get('/user/logout').then(function(response) {
      console.log('logged out');
      $location.path("/home");
    });
  }
}]);
