app = angular.module('ngResourceApp', ['firebase','loginDirective','angular-momentjs']);

app.controller('linksCtrl', function(FIREBASE_URI, $firebaseArray, $firebaseAuth, fireUser, $scope){

  $scope.loggedIn = fireUser.isLoggedIn();
  $scope.userIsLoggedIn = null;


  if($scope.loggedIn){
    fireUser.isLoggedIn().$onAuth(function(authData){
      $scope.authScope = authData;
      $scope.$watch('authScope', function(i, o){
        $scope.userIsLoggedIn = o ? true:false;
        //console.log($scope.userIsLoggedIn);
      });

    });

  } else {
    $scope.userIsLoggedIn = false;
    fireUser.logOut();
  }







});

app.filter('stringToDate', function($moment){
  return function(dateIn){
    return $moment(dateIn).format('M/D/YYYY') + ' at ' + $moment(dateIn).format('h:mmA');
  }
});
