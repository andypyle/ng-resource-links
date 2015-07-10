app = angular.module('ngResourceApp', ['firebase','loginDirective','angular-momentjs']);

app.controller('linksCtrl', function($rootScope, FIREBASE_URI, $firebaseArray, $firebaseAuth, fireUser){
  var scope = this;

});

app.filter('stringToDate', function($moment){
  return function(dateIn){
    return $moment(dateIn).format('M/D/YYYY') + ' at ' + $moment(dateIn).format('h:mmA');
  }
});
