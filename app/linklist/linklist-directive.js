app.directive('listLinks', function(FIREBASE_URI, $firebaseArray, fireUser){
var fb = new Firebase(FIREBASE_URI);
  return {
      restrict: 'E',
      templateUrl: 'linklist/linklist.html',
      scope: {},
      link: function(scope, elem, attrs){
        scope.loadingData = true;
        fireUser.isLoggedIn().$onAuth(function(authData){
          if(!authData){
            console.log('You are not logged in. Please log in.');
          } else {
            scope.links = $firebaseArray(fb.child('links'));
            scope.loadingData = false;
          }
        });
      }
    }
});
