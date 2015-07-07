app = angular.module('ngResourceApp', ['firebase','loginDirective']);

app.controller('linksCtrl', function($rootScope, FIREBASE_URI, $firebaseArray, $firebaseAuth, fireUser){
  var scope = this;
  var fb = new Firebase(FIREBASE_URI);

  scope.loadingData = true;

  fireUser.isLoggedIn().$onAuth(function(authData){
    if(!authData){
      console.log('You are not logged in. Please log in.');
    } else {
      scope.links = $firebaseArray(fb.child('links'));
      scope.loadingData = false;
    }
  });
});
