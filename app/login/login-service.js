login.factory('fireUser', function($firebaseAuth, FIREBASE_URI){
  var fb = new Firebase(FIREBASE_URI);
  var auth = $firebaseAuth(fb);
  return {
    isLoggedIn: function(){
      return (auth.$getAuth()) ? auth:false;
    },
    getUser: function(){
      var isAuthorized = (auth.$getAuth()) ? true:false;

      if(isAuthorized){
        return (auth.$getAuth().github || auth.$getAuth().google);
      } else {
        return isAuthorized;
      }

    },
    loginGithub: function(){
      auth.$authWithOAuthPopup('github')
        .then(function(authData){
          console.log('Welcome, ' + authData.github.displayName);
        })
        .catch(function(error){
          console.error('Authentication failed:', error);
        });
    },
    loginGoogle: function(){
      auth.$authWithOAuthPopup('google')
        .then(function(authData){
          console.log('Welcome, ' + authData.google.displayName);
        })
        .catch(function(error){
          console.error('Authentication failed:', error);
        });
    },
    logOut: function(){
      return auth.$unauth();
    }
  };
});
