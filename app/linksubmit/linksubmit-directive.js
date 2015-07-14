// Directive for link submit.
app.directive('submitLink', function(FIREBASE_URI, $firebaseArray, $firebaseAuth, fireUser, $moment){
var fbLinks = new Firebase(FIREBASE_URI + 'links/');
var fbTags = new Firebase(FIREBASE_URI + 'tags/');
  return {
      restrict: 'E',
      templateUrl: 'linksubmit/linksubmit.html',
      scope: {},
      link: function(scope, elem, attrs){
        scope.loadingData = true;
        scope.canSubmit = false;
        scope.visible = false;
        scope.isLoggedIn = (fireUser.isLoggedIn()) ? true:false;

        scope.$watch('isLoggedIn', function(i,o){
          scope.isLoggedIn = o;
        });

        scope.showAddLink = function(){
          return (scope.visible = !scope.visible);
        }

        scope.linkTagsArray = [];
        scope.addToTags = function(tags){
          if(tags !== ''){
            tagsArray = tags.split(', ');
          }

          angular.forEach(tagsArray, function(t){
            scope.linkTagsArray = tagsArray;
          });
        }

        scope.checkLink = function(url){
          var fbLinksCheck = new Firebase(FIREBASE_URI + 'links/');
          scope.linkExists = null;

          fbLinksCheck.orderByChild('url')
          .startAt(url)
          .endAt(url)
          .on('value', function(snap){
            scope.linkExists = snap.val();
          });

          return scope.linkExists;
        };

        scope.linkAdd = {};
        scope.emptyForm = {
          'title':'',
          'url':'',
          'desc':'',
          'tags':null
        };


        scope.addLink = function(title, url, desc, tags){
          var fbLinksAdd = new Firebase(FIREBASE_URI + 'links/');
          var fbLinksAddArray = $firebaseArray(fbLinksAdd);
          var curDate = $moment().toISOString();

          var toAdd = {
            'url':url,
            'title':title,
            'description':desc,
            'createdAt':curDate.toString(),
            'createdBy': {
              'name':fireUser.getUser().name,
              'uid':fireUser.getUser().$id,
              'uimg':fireUser.getUser().avatar
            },
            'tags': scope.linkTagsArray,
            'isHelpful':[]
          };

          if(!scope.checkLink(url)){
            fbLinksAddArray.$add(toAdd);
            scope.linkAdd = angular.copy(scope.emptyForm);
            scope.linkTagsArray = [];
            scope.visible = false;
          } else {
            console.error('Link already exists. Cannot add to db.');
          }
        }
    }
  }
});
