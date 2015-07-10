app.directive('listLinks', function(FIREBASE_URI, $firebaseArray, $firebaseAuth, fireUser, $moment){
var fb = new Firebase(FIREBASE_URI + 'links/');
  return {
      restrict: 'E',
      templateUrl: 'linklist/linklist.html',
      scope: {},
      link: function(scope, elem, attrs){
        scope.loadingData = true;
        scope.links = [];

        fireUser.isLoggedIn().$onAuth(function(authData){
          if(!authData){
            console.log('You are not logged in. Please log in.');
          } else {
            scope.links = $firebaseArray(fb);
            scope.loadingData = false;




            scope.ownsDocument = function(docId){
              var userId = fireUser.isLoggedIn().$getAuth().uid;
              var fbLinks = new Firebase(FIREBASE_URI + 'links/' + docId[0] + '/createdBy/' + userId);

              fbLinks.orderByChild('uid')
                .startAt(userId)
                .endAt(userId)
                .on('value', function(snap){
                  if(snap.key() === userId)
                    scope.ownsLink = true;
                  else
                    scope.ownsLink = false;

                  return scope.ownsLink;
                });

            }

          }
        });
      }
    }
});
