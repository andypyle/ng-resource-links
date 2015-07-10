login.factory('fireUser', function($firebaseArray, $firebaseAuth, FIREBASE_URI){
  var fb = new Firebase(FIREBASE_URI);
  var auth = $firebaseAuth(fb);
  var fbUser = new Firebase(FIREBASE_URI + 'users/');
  var fbUserArray = $firebaseArray(fbUser);
  var isNewUser = null;

  var checkUserExist = function(userId){
    var userInfo = fbUserArray.$getRecord(userId);
    if(!userInfo){
      return false;
    } else {
      return true;
    }
  };

  var getUserInformation = function(userId){
    var user = fbUserArray.$getRecord(userId);
    return user;
  }

  return {
    isLoggedIn: function(){
      return (auth.$getAuth()) ? auth:false;
    },
    getUser: function(){
      var isAuthorized = (auth.$getAuth()) ? true:false;

      if(isAuthorized){
        return getUserInformation(auth.$getAuth().uid);
      } else {
        return isAuthorized;
      }

    },
    loginGithub: function(){
      auth.$authWithOAuthPopup('github')
        .then(function(authData){
          if(!checkUserExist(authData.uid)){
            console.log(authData);
            var fbUserAdd = new Firebase(FIREBASE_URI + 'users/');
            var fbUserArrayAdd = $firebaseArray(fbUserAdd);
            userId = authData.uid;
            var newUser = {
                'name' : authData.github.displayName,
                'email' : authData.github.email,
                'avatar' : authData.github.profileImageURL,
                'read' : [],
                'foundUseful' : []
            };

            fbUserAdd.child(authData.uid).set(newUser);
          } else {
            console.log('Welcome, ' + authData.github.displayName);
          }

        })
        .catch(function(error){
          console.error('Authentication failed:', error);
        });
    },
    loginGoogle: function(){
      auth.$authWithOAuthPopup('google')
        .then(function(authData){
          if(!checkUserExist(authData.uid)){
            console.log(authData);
            var fbUserAdd = new Firebase(FIREBASE_URI + 'users/');
            var fbUserArrayAdd = $firebaseArray(fbUserAdd);

            var newUser = {
                'name' : authData.google.displayName,
                'email' : '',
                'avatar' : authData.google.profileImageURL,
                'read' : [],
                'foundUseful' : []
            };

            fbUserAdd.child(authData.uid).set(newUser);
          } else {
            console.log('Welcome, ' + authData.google.displayName);
          }
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
