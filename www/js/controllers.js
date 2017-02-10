angular.module('bhook.controllers', ['bhook.directives','ionic.rating'])
.controller('LoginCtrl', function ($scope,$state,$q, UserService, bookService,settingsService,$ionicModal,$translate,$ionicLoading,$ionicActionSheet ) { 
    $scope.user = UserService.getUser();
    var logged = false ;
    if($scope.user.userID) {
        logged = true ;
    }
    
    $scope.$on('$ionicView.enter', function(e) {
        if ($translate.use() == "fr") {
            $scope.loginen = false;
            $scope.loginfr = true;
        } else {
            $scope.loginfr = false;
            $scope.loginen = true;
        }
    });


// from https://ionicthemes.com/tutorials/about/native-facebook-login-with-ionic-framework
// This is the success callback from the login method
  var fbLoginSuccess = function(response) {
    if (!response.authResponse){
      fbLoginError("Cannot find the authResponse");
      return;
    }

    var authResponse = response.authResponse;

    getFacebookProfileInfo(authResponse)
    .then(function(profileInfo) {
      // For the purpose of this example I will store user data on local storage
      UserService.setUser({
        authResponse: authResponse,
				userID: profileInfo.id,
				name: profileInfo.name,
				email: profileInfo.email,
        picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
      });
      $ionicLoading.hide(); 
    }, function(fail){
      // Fail get profile info
    });
  };

  // This is the fail callback from the login method
  var fbLoginError = function(error){
    $ionicLoading.hide();
  };

  // This method is to get the user profile info from the facebook api
  var getFacebookProfileInfo = function (authResponse) {
    var info = $q.defer();

    facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
      function (response) {
                info.resolve(response);
      },
      function (response) {
                info.reject(response);
      }
    );
    return info.promise;
  };

  //This method is executed when the user press the "Login with facebook" button
  $scope.facebookSignIn = function() {
    facebookConnectPlugin.getLoginStatus(function(success){
      if(success.status === 'connected'){
        // The user is logged in and has authenticated your app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed request, and the time the access token
        // and signed request each expire

    		// Check if we have our user saved
    		var user = UserService.getUser('facebook');

    		if(!user.userID){
					getFacebookProfileInfo(success.authResponse)
					.then(function(profileInfo) {
						// For the purpose of this example I will store user data on local storage
						UserService.setUser({
							authResponse: success.authResponse,
							userID: profileInfo.id,
							name: profileInfo.name,
							email: profileInfo.email,
							picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
						});
						
					}, function(fail){
						// Fail get profile info
					});
				}else{
					
				}
      } else {
        // If (success.status === 'not_authorized') the user is logged in to Facebook,
				// but has not authenticated your app
        // Else the person is not logged into Facebook,
				// so we're not sure if they are logged into this app or not.


				$ionicLoading.show({
                    template: 'Logging in...'
                });

				// Ask the permissions you need. You can learn more about
				// FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
                facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
      }
    });
  };
  
  
  // log out 
  
	$scope.showLogOutMenu = function() {
		var hideSheet = $ionicActionSheet.show({
			destructiveText: 'Logout',
			titleText: $translate.instant("logging_out")  ,
			cancelText: 'Cancel',
			cancel: function() {},
			buttonClicked: function(index) {
				return true;
			},
			destructiveButtonClicked: function(){
				$ionicLoading.show({
				  template: 'Logging out...'
				});
        UserService.setUser('{}'); 
        // Facebook logout
        facebookConnectPlugin.logout(function(){
            $ionicLoading.hide();
        },
        function(fail){
          $ionicLoading.hide();
        });
			}
		});
	};
})
.controller('DashboardCtrl', function($scope,$http ,API_URL, bookService,settingsService,$ionicModal,$translate ) {
	bookService.initDB(API_URL);

	 // resolve settings , only local
    settingsService.initDB(); 
    settingsService.getLanguage().then(function(language){
            $translate.use(language) ;
	 });

    // set the rate and max variable for ionic rating
    $scope.rate = 3;
    $scope.max = 5;
    //data to populate a book object
    $scope.submitData= {"rate" : null }; 
    // other data values binded into controller
    $scope.data= {};

   	$scope.$on('$ionicView.enter', function(e) {
        settingsService.initDB(); 
        settingsService.getLanguage().then(function(language){
            $translate.use(language) ;
            $scope.data.formBookAuthorText = $translate.instant("add_a_book") ;
	    });
       
 	});



    // the first skip for the latest book list is the first 8 already called by default
    // Create the auth/book distinction modal that is used before the insertion of data
    $ionicModal.fromTemplateUrl('templates/addauthbookmodal.html', function ($ionicModal) {
        $scope.modalauthbook = $ionicModal;
    }, {
            scope: $scope
        }).then(function (modalauthbook) {
            $scope.modalauthbook = modalauthbook;
        });

	 // Create the auth first and last distinction modal that is used before the insertion of data
	 $ionicModal.fromTemplateUrl('templates/addauthmodal.html',function($ionicModal) {
 			$scope.modalauth = $ionicModal;
	 }, {
		 scope: $scope
	 }).then(function(modalauth) {
		 $scope.modalauth = modalauth;
	 });




	 // addbook click - beginning of the input
	 $scope.addBook = function(){
		 // remove actual text from the input .
		 $scope.data.formBookAuthorText = null;

	};




	 // opens a modal dialog window to sort values b/n  auth/book book/auth surn/firstname, to read true/false ..
	 $scope.openModalAuthBook = function(){
		 $scope.modalauthbook.show();
		 $scope.submitData.toread = 'YES';
		 $scope.arrowDirectionClass = "ion-arrow-down-c";
		 $scope.sensetogo = "right";
		 $scope.submitData.author= $scope.data.formBookAuthorText.split(/[\s+]+/gm).filter(Boolean).join(" ");
		 $scope.submitData.book = "" ;
	 };

	 // close the AuthBook modal
	 $scope.closeAuthBookModal=	function(){
		 $scope.modalauthbook.hide();
	 };
	 $scope.closeAuthModal=	function(){
		 $scope.modalauth.hide();
	 };
     $scope.closeTypeModal=	function(){
		 $scope.modaltype.hide();
	 };
     
	 // prepare author data
	 $scope.prepareAuthData = function(){
 		$scope.modalauthbook.hide();
 		// we need the firstname/lastname distinction for an author
 		$scope.openAuthModal();
	 };


	 // submitAuthBook
	 $scope.submitAuthBook = function(){
	 	 //	Object {book: "dqd", author_firstname: "sqsq", author_lastname: "" }
	 		// remove unecessary fields
	 		delete	$scope.submitData.author ;
	 		// add timestamp
	 		$scope.submitData.added = new Date(); 
              
             // transform all capital letters
             $scope.submitData.author_lastname =  $scope.submitData.author_lastname.toLowerCase() ;
             $scope.submitData.author_firstname =  $scope.submitData.author_firstname.toLowerCase() ;
             $scope.submitData.book =  $scope.submitData.book.toLowerCase() ;
			// build the id using alphabetical order
			$scope.submitData._id = $scope.submitData.author_lastname+'-'+$scope.submitData.author_firstname+'-'+$scope.submitData.book;

           // field toread :change YES/NO for true false in database
			if($scope.submitData.toread == 'YES'){ 
				$scope.submitData.toread = true ; 
	 			//unset comments and star rating
				delete $scope.submitData.comment ;
				delete $scope.submitData.rate ;

			} else{
				$scope.submitData.toread = false ;
			}
			 // the id is the author name plus
	 		//add the book
	 		bookService.addBook($scope.submitData).then(function(book){
				    $scope.latestbooks.unshift($scope.submitData) ;
					$scope.modalauth.hide();
					$scope.data.formBookAuthorText = $translate.instant("add_a_book") ;
	 		});
	 };
	 // open the AuthModal
	 $scope.openAuthModal=	function(){
 		$scope.modalauth.show();
 		$scope.arrowDirectionClass = "ion-arrow-down-c";
 		$scope.sensetogo = "right" ;
 		$scope.submitData.author_firstname = $scope.submitData.author.split(/[\s+]+/gm).filter(Boolean).join(" ");
 		$scope.submitData.author_lastname = "" ;
		$scope.formBookAuthorText = $translate.instant("add_a_book") ;
	 };
   $scope.end = true ;
   $scope.latestbooks = [];
	 // populate latest book
		$scope.$on('$ionicView.enter', function(e) {
			//debuggin directive
			//$scope.openModalAuthBook();
                
            
			 //Refresh list when entering the view, an item can have been updated/deleted in another controller
			 bookService.getLatestBooks(0).then(function(bookssortedbydate){
	 				$scope.latestbooks = bookssortedbydate ;
					//$scope.end = false ;
                    $scope.end = false ;
	 		 });
 		});
 
		// infinite scrolling
		
		$scope.loadMore = function() {
				if(!$scope.latestbooks){
					return;
				}

				skip = $scope.latestbooks ? $scope.latestbooks.length : 0 ;
				bookService.getLatestBooks(skip).then(function(bookssortedbydate){
					if(bookssortedbydate.length === 0) {
						$scope.end = true ;
					}
					Array.prototype.push.apply($scope.latestbooks,bookssortedbydate);
				}).finally(function(){
						 $scope.$broadcast('scroll.infiniteScrollComplete');
					});
	  };



})
.controller('WishlistCtrl', function($scope, $http, API_URL, bookService, $ionicModal,UserService) {
    bookService.initDB(API_URL);
    
    
    $scope.user = UserService.getUser();
    
    var logged = false ;
    if($scope.user.userID !== null) {
        logged = true ;
    }
    
    
   
   // set the rate and max variable for ionic rating
    $scope.rate = 3;
    $scope.max = 5;
    
    // modal for update item form 
    $ionicModal.fromTemplateUrl('templates/itemupdateform.html', function($ionicModal) {
        $scope.itemupdate = $ionicModal;
    }, {
            scope: $scope
        }).then(function(itemupdate) {
            $scope.itemupdate = itemupdate;
     });

    
    $scope.end = true;
    $scope.$on('$ionicView.enter', function(e) {
        bookService.getToRead().then(function(books) {
            $scope.wishlist = books;
            $scope.end = false;
        }).catch(function(err) {
        });

    });
    $scope.loadMore = function() {
        if (!$scope.wishlist) {
            return;
        }
        var skip = $scope.wishlist ? $scope.wishlist.length : 0;
        bookService.getToRead(skip).then(function(books) {
            if (books.length === 0) {
                $scope.end = true;
            }
            Array.prototype.push.apply($scope.wishlist, books);
        }).finally(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete');
             
        });
    }; 
    $scope.deleteItem = function(index) {
        bookService.deleteBook($scope.wishlist[index]._id).then(function(book) {
            $scope.wishlist.splice(index, 1);
        });
    };
    
    
    $scope.shareItem = function(index) {
        // TODO


    };
    
    
    
    $scope.updateItem = function(index) {
        
        $scope.itemupdate.show();
        $scope.submitData = $scope.wishlist[index] ;
        $scope.submitData.toread = "YES" ;        
        $scope.itemupdate.show();
    };
    $scope.submitItem = function(index) {
        
        if($scope.submitData.toread != 'YES'){
				$scope.submitData.toread = false ;
                // remove from view 
                $scope.wishlist.splice(index, 1) ;
		} else{
			$scope.submitData.toread = true ;
		}
        bookService.updateBook($scope.submitData) ;
        $scope.itemupdate.hide();
        
        
    };
    
    $scope.closeUpdateModal=	function(){
        
		 $scope.itemupdate.hide();
	};
    
})
.controller('ReadlistCtrl', function($scope,$http ,API_URL, bookService , $ionicModal, UserService, $translate) {
    bookService.initDB(API_URL);
     // set the rate and max variable for ionic rating
    $scope.rate = 3;
    $scope.max = 5;
    
    $scope.user = UserService.getUser();
    
 
    if($scope.user.userID !== null) {
        $scope.logged = true ;
    }
 
    // debugmode 
    $scope.logged = true ;
    
    
    
    // modal for update item form 
    $ionicModal.fromTemplateUrl('templates/itemupdateform.html', function($ionicModal) {
        $scope.itemupdate = $ionicModal;
    }, {
            scope: $scope
        }).then(function(itemupdate) {
            $scope.itemupdate = itemupdate;
     });

    
    // modal to share item on facebook 
    $ionicModal.fromTemplateUrl('templates/share.html', function($ionicModal) {
        $scope.itemshare = $ionicModal;
    }, {
            scope: $scope
        }).then(function(itemshare) {
            $scope.itemshare = itemshare;
     });

  
  
    $scope.end = true ;
    $scope.$on('$ionicView.enter', function(e) {
        bookService.getAlreadyRead().then(function(books) {
            $scope.readlist = books;
            $scope.end = false;
        }).catch(function(err) {
        });
    });


 
 $ionicModal.fromTemplateUrl('templates/showreadbook.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.modal = modal;
  });

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

    var $selectedItemIndex ;

 
    $scope.loadMore = function() {

        var skip = $scope.readlist ? $scope.readlist.length : 0;
        bookService.getAlreadyRead(skip).then(function(books) {
            if (books.length === 0) {
                $scope.end = true;
            }
            Array.prototype.push.apply($scope.readlist, books);
        }).finally(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };

    
    $scope.deleteItem = function(index) {
        bookService.deleteBook($scope.readlist[index]._id).then(function(book) {
            $scope.readlist.splice(index, 1);
        });
    };
    
    $scope.shareItem = function(index) {
        // TODO
         $scope.itemshare.show();
         selectedItemIndex = index;
         $scope.submitData = $scope.readlist[index] ;
    };
    

    $scope.sendItemtoFacebook = function(){ 




           // selected item is still the same, build a message for facebook 
            var book = $scope.readlist[selectedItemIndex] ;
            var messageFacebook = $translate.instant('share sentence')  + book.book + $translate.instant('by') + book.author_firstname + " "+ book.author_lastname;
            messageFacebook +=  " " + $translate.instant('what i say about it') + " " + book.comment ;
            
            facebookConnectPlugin.showDialog( 
                    {
                        method: "feed",
                        message:messageFacebook,   
                        
                    }, 
                    function (response) { alert(JSON.stringify(response)) },
                    function (response) { alert(JSON.stringify(response)) });



    }

    $scope.updateItem = function(index) {
        $scope.submitData = $scope.readlist[index] ;
        $scope.submitData.toread = "NO" ;        
        $scope.itemupdate.show();
    };


    $scope.submitItem = function(index) {
        
        if($scope.submitData.toread != 'NO'){
				$scope.submitData.toread = true ;
                // remove from view 
                $scope.readlist.splice(index, 1) ;
		} else{
			$scope.submitData.toread = false;
		}
        bookService.updateBook($scope.submitData) ;
       
        $scope.itemupdate.hide();
    };
    
    $scope.closeUpdateModal=	function(){
		 $scope.itemupdate.hide();
	};

        $scope.closeShareModal=	function(){
		 $scope.itemshare.hide();
	};




})
.controller('SettingsCtrl', function ($scope, settingsService, bookService, $translate, $window, $cordovaFile, $ionicPlatform , $ionicPopup) {
        // FIXME  : should use a singleton
        bookService.initDB();
        $scope.translations = translations;
        settingsService.initDB(); // only local
        //default value is set to french and willbe overriden  by db value
        $scope.data = {
            selectedLanguage: 'fr',
            settingsdir : 'test'
        };
        $scope.$on('$ionicView.enter', function (e) {
            // get current language value from settingsService
            settingsService.getLanguage().then(function (language) {
                $translate.use(language);

                $scope.data.selectedLanguage = language;
            });
        });
        $scope.languageChange = function (language) {
            // remove actual text from the input .
            $translate.use(language);
            // save the change
            settingsService.setLanguage(language);
        };
        $scope.savedatabase = function () {  
            // only if device ready ,this  won't work on browser emulation 
            $ionicPlatform.ready(function() {
                bookService.saveDatabase().then(function (jsondata) {
                var fileDir ;   
                var date = new Date();
                var bhookdbbackup = "bhook_db_backup_" + date.getFullYear().toString() + "_" + (date.getMonth() + 1).toString() + "_" + date.getDate().toString() + ".json";   
                if (ionic.Platform.isAndroid()) {
                    // resolve the dir depending on type of device
                     fileDir = cordova.file.externalRootDirectory  ;
                }
                if (ionic.Platform.isIOS()) {
                    fileDir = cordova.file.documentsDirectory; 
                }
                if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {               
                    // Write  into file 
                    $cordovaFile.writeFile( fileDir , bhookdbbackup , jsondata , true).then(function (success) {
                            // success 
                            //show a message where the file is located 
                                // Custom popup
                                $ionicPopup.show({
                                    template: $translate.instant("save_db_info") + " " +fileDir + bhookdbbackup,
                                    title: $translate.instant("save_db"),
                                    scope: $scope,
                                    buttons: [
                                        { text: $translate.instant("close") }
                                    ]
                                });
                             return bhookdbbackup ;
                                                         
                        }, function (error) {
                                 $ionicPopup.show({
                                    template: $translate.instant("save_db_error") + " " +fileDir,
                                    title: $translate.instant("save_db"),
                                    scope: $scope,
                                    buttons: [
                                        { text: $translate.instant("close") }
                                    ]
                                });
                            // error 
                        });
                }
                });
            });
            

            
        };
        $scope.restoredatabase = function () {
          $ionicPlatform.ready(function() { 
                var fileDir ;   
                var date = new Date();
                var bhookdbbackup = "bhook.json";   
                  
                if (ionic.Platform.isAndroid()) {
                    // resolve the dir depending on type of device
                     fileDir = cordova.file.externalRootDirectory  ;
                    
                }
                if (ionic.Platform.isIOS()) {
                    fileDir = cordova.file.documentsDirectory; 
                }
         
                //now read the file 
                // check file exists, if not return the message in a popup 
                $cordovaFile.checkFile(fileDir,bhookdbbackup ).then(function(){
                 $cordovaFile.readAsText(fileDir,bhookdbbackup ).then(function(dumpedbased) {
                    bookService.restoreDatabase(dumpedbased).then(function (result) {
                        if(result === true){
                            $ionicPopup.show({
                                    template: $translate.instant("restore_db_info"),
                                    title: $translate.instant("restore_db"),
                                    scope: $scope,
                                    buttons: [
                                        { text: $translate.instant("close") }
                                    ]
                                });
                        }else{
                             $ionicPopup.show({
                                    template: $translate.instant("restore_db_error") + " " + fileDir+bhookdbbackup,
                                    title: $translate.instant("restore_db"),
                                    scope: $scope,
                                    buttons: [
                                        { text: $translate.instant("close") }
                                    ]
                                });
                         
                        }
                    });
                });                   
                },function(error){
                                          $ionicPopup.show({
                                    template: $translate.instant("restore_db_error" +fileDir+bhookdbbackup ),
                                    title: $translate.instant("restore_db"),
                                    scope: $scope,
                                    buttons: [
                                        { text: $translate.instant("close") }
                                    ]
                                });
                    
                } ) ;
                   
          });
              
              
          
        };


    })
    .controller('CreditsCtrl', function($scope, $translate) {
        $scope.$on('$ionicView.enter', function(e) {
            if ($translate.use() == "fr") {
                $scope.creditsen = false;
                $scope.creditsfr = true;
            } else {
                $scope.creditsfr = false;
                $scope.creditsen = true;
            }
        });
  
})
.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http ,API_URL, bookService ) {

	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//$scope.$on('$ionicView.enter', function(e) {
	//});

	// Form data for the login modal

 


})
.controller('addauthbookCtrl', function($scope) {
	//$scope.submitData.author = $scope.formBookAuthorText ;

});

