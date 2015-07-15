app.directive('listLinks', function(FIREBASE_URI, $firebaseArray, $firebaseAuth, fireUser, $moment){
var fb = new Firebase(FIREBASE_URI + 'links/');
  return {
      restrict: 'E',
      templateUrl: 'linklist/linklist.html',
      scope: {},
      link: function(scope, elem, attrs){
        scope.loadingData = true;
        scope.isLoggedIn = (fireUser.isLoggedIn()) ? true:false;

        // Grab list of links from Firebase if user is logged in.
        fb.on('value', function(data){
          if(fireUser.isLoggedIn()){
            scope.links = $firebaseArray(data.ref());
            scope.loadingData = false;
            scope.isLoggedIn = true;
            scope.$watchCollection('links', function(i,o){
              //scope.links = i;
            });
            scope.$apply();
          }
        }); /// END LIST FETCH

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
        } /// END CHECK OWNERSHIP FUNCTION

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
        } /// END DELETE FUNCTION

        scope.linkTagsEditArray = null;
        // Edit link if you own the document.
        scope.linkEdit = function(linkId){
          if(scope.ownsDocument(linkId)){
            scope.editor = {};
            scope.editing = this.$index;
            scope.editorTags = [];

            scope.checkLink = function(url, linkId){
              var fbLinksCheck = new Firebase(FIREBASE_URI + 'links/');
              scope.linkExists = null;

              fbLinksCheck.orderByChild('url')
              .startAt(url)
              .endAt(url)
              .on('value', function(snap){
                  if(snap.val() !== null){
                    scope.linkExists = (snap.val()) ? true:false;
                    if(snap.val()[linkId]){
                      scope.linkSamePost = (snap.val()[linkId]['url'] === url);
                    }
                  }
              });

            };


            scope.refreshTags = function(tags){
              scope.editorTags = angular.copy(tags);
            }

            scope.refreshTitle = function(title){
              scope.editTitle = angular.copy(title);
            }

            scope.removeTag = function(tagIndex){
              scope.tempTags = angular.copy(scope.editorTags);

              scope.tempTags.splice(tagIndex, 1);
              scope.editorTags = angular.copy(scope.tempTags);
              return scope.editorTags;
            }

            scope.editTags = function(tags){
                //var splitter = ',' || ', ';
                //tagsEditArray = tags.split(',');
                console.log(tags);
                return scope.editorTags = angular.copy(tags);

                angular.forEach(tags, function(t){
                  scope.editorTags = tags;
                });
            }

            scope.saveEdit = function(linkId){
              var fbLinkEdit = new Firebase(FIREBASE_URI + 'links/' + linkId);
              var fbLinkEditArray = $firebaseArray(fbLinkEdit);


              var toEdit = {
                'url':this.editor.url,
                'title':this.editor.title,
                'description':this.editor.description,
                'tags':this.editorTags
              };

              //var linkChecker = scope.checkLink(this.editor.url);
              //var linkCheckerWithId = linkChecker[linkId];

              //console.log(linkCheckerWithId.url);
              scope.urlExists = (scope.linkSamePost != scope.linkExists)
              scope.urlSame = scope.linkExists;

              if((scope.urlExists) || (scope.urlSame)){
                fbLinkEdit.update(toEdit);
                console.log('Successfully updated.');
                scope.linkTagsEditArray = [];
                scope.editing = false;
              } else {
                console.error('Link already exists. Cannot add to db.');
              }
            }
          } else {
            console.error('Unable to edit.');
          }


        } /// END EDIT FUNCTION

    }
  }
});
