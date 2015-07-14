login = angular.module('loginDirective', ['firebase']);

login.directive('fireLogin', function($firebaseAuth, FIREBASE_URI, fireUser){
  return {
    restrict: 'E',
    templateUrl: 'login/login.html',
    scope: {},
    link: function(scope, elem, attrs){
      scope.google = 'google' in attrs;
      scope.github = 'github' in attrs;
      scope.email = 'email' in attrs;

      scope.authGithub = function(){
        return fireUser.loginGithub();
      }

      scope.authGoogle = function(){
        return fireUser.loginGoogle();
      }

      scope.checkUser = function(){
        scope.loggedIn = fireUser.isLoggedIn();
        return scope.loggedIn;
      }

      scope.getUserInfo = function(){
        return fireUser.getUser();
      }

      scope.signOut = function(){
        return fireUser.logOut();
      }
    }
  }
});
