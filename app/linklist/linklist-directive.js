app.directive('listLinks', function(FIREBASE_URI, $firebaseArray, $firebaseAuth, fireUser, $moment){
var fb = new Firebase(FIREBASE_URI + 'links/');
  return {
      restrict: 'E',
      templateUrl: 'linklist/linklist.html',
      scope: {},
      link: function(scope, elem, attrs){
        scope.loadingData = true;
        scope.isLoggedIn = (fireUser.isLoggedIn()) ? true:false;

        scope.$watch('isLoggedIn', function(i,o){
          scope.isLoggedIn = o;
        });

        fb.on('value', function(data){
          if(fireUser.isLoggedIn()){
            scope.links = $firebaseArray(data.ref());
            scope.loadingData = false;
            scope.isLoggedIn = true;
          }
        });

        // Check if the current user owns the document. If so, return true.
        scope.ownsDocument = function(docId){
          var userId = fireUser.isLoggedIn().$getAuth().uid;
          var fbLinks = new Firebase(FIREBASE_URI + 'links/' + docId);

          fbLinks.orderByChild('createdBy')
            .limitToFirst(2)
            .on('value', function(snap){
              scope.isOwner = (snap.val().createdBy.uid === userId);
            });
          return scope.isOwner;
        }

        // Delete link, only if you own the document.
        scope.linkDelete = function(linkId){
        var fbLinks = new Firebase(FIREBASE_URI + 'links/' + linkId);

        fbLinks.once('value', function(snap){
          scope.linkTitle = snap.val().title;
        });

        var verifyDelete = confirm('Delete link: ' + scope.linkTitle + '?');
        if(verifyDelete && scope.ownsDocument(linkId)){
          fbLinks.remove(function(er){
            if(er)
              console.error('Error: ' + er);
            else
              console.log('Link: ' + scope.linkTitle + ' deleted.');
          });
        } else {
          console.error('Document not deleted.');
        }
      }
    }
  }
});
