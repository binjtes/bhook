angular.module('bhook.controllers', ['bhook.directives','ionic.rating'])
.controller('DashboardCtrl', function($scope,$http ,API_URL, bookService,settingsService,$ionicModal,$translate ) {
	bookService.initDB(API_URL);

	 // resolve settings
    settingsService.initDB(); // only local
        settingsService.getLanguage().then(function(language){
            $translate.use(language) ;
	 });

    // set the rate and max variable for ionic rating
    $scope.rate = 3;
    $scope.max = 5;
    //data to populate a book object
    $scope.submitData= {};
    // other data values binded into controller
    $scope.data= {};

    $scope.data.formBookAuthorText = $translate.instant("add_a_book") ;
    // $scope.data.formBookAuthorText = $translate.instant("add_a_book") ;
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
		 $scope.sensetogo = "right"
		 $scope.submitData.author= $scope.data.formBookAuthorText.split(/[\s+]+/gm).filter(Boolean).join(" "); ;
		 $scope.submitData.book = "" ;
	 };

	 // close the AuthBook modal
	 $scope.closeAuthBookModal=	function(){
		 $scope.modalauthbook.hide();
	 }
	 $scope.closeAuthModal=	function(){
		 $scope.modalauth.hide();
	 }
	 // prepare author data
	 $scope.prepareAuthData = function(){
 		$scope.modalauthbook.hide();
 		// we need the firstname/lastname distinction for an author
 		$scope.openAuthModal();
	 }


	 // submitAuthBook
	 $scope.submitAuthBook = function(){
	 	 //	Object {book: "dqd", author_firstname: "sqsq", author_lastname: "" }
	 		// remove unecessary fields
	 		delete	$scope.submitData.author ;
	 		// add timestamp
	 		$scope.submitData['added'] = new Date();
             
             // transform all capital letters
             $scope.submitData['author_lastname'] =  $scope.submitData['author_lastname'].toLowerCase() ;
             $scope.submitData['author_firstname'] =  $scope.submitData['author_firstname'].toLowerCase() ;
             $scope.submitData['book'] =  $scope.submitData['book'].toLowerCase() ;
			// build the id using alphabetical order
			$scope.submitData['_id'] = $scope.submitData['author_lastname']+'-'+$scope.submitData['author_firstname']+'-'+$scope.submitData['book'];

      // field toread :change YES/NO for true false in database
			if($scope.submitData.toread == 'YES'){
				$scope.submitData.toread = true ;
	 			//unset comments and star rating
				delete $scope.submitData.comment ;
				delete $scope.submitData.rating ;

			} else{
				$scope.submitData.toread = false ;
			}
			 // the id is the author name plus
	 		console.log($scope.submitData) ;
	 		//add the book
	 		bookService.addBook($scope.submitData).then(function(book){
				  $scope.latestbooks.unshift($scope.submitData) ;
					$scope.modalauth.hide();
					$scope.data.formBookAuthorText = $translate.instant("add_a_book") ;
	 		});
	 }
	 // open the AuthModal
	 $scope.openAuthModal=	function(){
 		$scope.modalauth.show();
 		$scope.arrowDirectionClass = "ion-arrow-down-c";
 		$scope.sensetogo = "right" ;
 		$scope.submitData.author_firstname = $scope.submitData.author.split(/[\s+]+/gm).filter(Boolean).join(" ");
 		$scope.submitData.author_lastname = "" ;
		$scope.formBookAuthorText = $translate.instant("add_a_book") ;
	 }
   $scope.latestbooks = [];
	 // populate latest book
		$scope.$on('$ionicView.enter', function(e) {
			console.log("$ionicView.enter") ;
			//debuggin directive
			//$scope.openModalAuthBook();


			 //Refresh list when entering the view, an item can have been updated/deleted in another controller
			 bookService.getLatestBooks(0).then(function(bookssortedbydate){
	 				$scope.latestbooks = bookssortedbydate ;
					$scope.end = false ;
					console.log("first adding");
	 				console.log(bookssortedbydate);
	 		 });
 		});

		// infinite scrolling
		$scope.end = false ;
		$scope.loadMore = function() {
				if(!$scope.latestbooks){
					return;
				}

				skip = $scope.latestbooks ? $scope.latestbooks.length : 0 ;
				console.log("skip :" + skip);
				bookService.getLatestBooks(skip).then(function(bookssortedbydate){
					if(bookssortedbydate.length == 0) {
						$scope.end = true ;
					}
					Array.prototype.push.apply($scope.latestbooks,bookssortedbydate);
				}).finally(function(){
						 $scope.$broadcast('scroll.infiniteScrollComplete');
					});
	  };
            /************* debug functions *****************/
			$scope.testaddBook = function(){

				console.log($scope.bookService);
				var book2 = {
					_id : "chinua-achebe-le-monde-s-effondre-"+ new Date().toString() ,
					author_firstname:	"Chinua",
					author_lastname: "Achebe",
					book: "Le monde s'effondre" ,
					added:	new Date() ,
					to_read : true } ;

					 return bookService.addBook(book2).then(function(book){
								$scope.latestbooks.push(book2) ;
								return true;

		 				}).catch(function (err) {
							 console.log(err);
						 });
			};
			$scope.resetdb = function(){
				bookService.resetDb();
				// populate
				var book1 = {
					_id : "andersen-hans-christian-contes",
					author_firstname: "Hans Christian",
					author_lastname: "Andersen",
					book: "Contes" ,
					added:	"2015-12-13T17:33:02.276Z",
					toread : true } ;
					bookService.addBook(book1) ;
					var book2 = {
						_id : "chinua-achebe-le-monde-s-effondre",
						author_firstname: "Chinua",
						author_lastname: "Achebe",
						book: "Le monde s'effondre" ,
						added:	new Date() ,
						toread : true } ;

					 bookService.addBook(book2) ;
		}

})
.controller('WishlistCtrl', function($scope,$http ,API_URL, bookService ) {
	bookService.initDB(API_URL);

    $scope.end = true ;
		$scope.$on('$ionicView.enter', function(e) {
				bookService.getToRead().then(function(books){
						 $scope.wishlist = books ;
						   $scope.end = false ;
					}).catch(function (err){
							console.log(err);
					});
		});
		$scope.loadMore = function() {
			console.log("in there");
				if(!$scope.wishlist){
					console.log("wishlist undefined");
					return ;
				}
				var skip = $scope.wishlist ? $scope.wishlist.length : 0 ;
				console.log("skip " + skip);
				bookService.getToRead(skip).then(function(books){
					if(books.length == 0) {
						$scope.end = true ;
					}
					Array.prototype.push.apply($scope.wishlist,books);
				}).finally(function(){
						 $scope.$broadcast('scroll.infiniteScrollComplete');
					});
	  };


		$scope.deleteBook = function(index){
			bookService.deleteBook($scope.wishlist[index]['_id']).then(function(book){
				console.log(book);
				$scope.wishlist.splice(index, 1);

			});


		}




})
.controller('ReadlistCtrl', function($scope,$http ,API_URL, bookService ) {
	bookService.initDB(API_URL);
  $scope.end = true ;
		$scope.$on('$ionicView.enter', function(e) {
				bookService.getAlreadyRead().then(function(books){
						 $scope.readlist = books ;
						 $scope.end = false ;
					}).catch(function (err){
							console.log(err);
					});
		});
		$scope.loadMore = function() {
			console.log("in there");

				var skip = $scope.readlist ? $scope.readlist.length : 0 ;
				console.log("skip " + skip);
				bookService.getAlreadyRead(skip).then(function(books){
					if(books.length == 0) {
						$scope.end = true ;
					}
					Array.prototype.push.apply($scope.readlist,books);
				}).finally(function(){
						 $scope.$broadcast('scroll.infiniteScrollComplete');
					});
	  };


		$scope.deleteBook = function(index){
			bookService.deleteBook($scope.wishlist[index]['_id']).then(function(book){
				console.log(book);
				$scope.wishlist.splice(index, 1);

			});


		}




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
                    console.log('cordova.file.externalRootDirectory: ' + cordova.file.externalRootDirectory);
                     fileDir = cordova.file.externalRootDirectory  ;
                     console.log('ANDROID FILEDIR: ' + fileDir);
                    
                }
                if (ionic.Platform.isIOS()) {
                    console.log('cordova.file.documentsDirectory: ' + cordova.file.documentsDirectory);
                    fileDir = cordova.file.documentsDirectory; 
                    console.log('IOS FILEDIR: ' + fileDir);
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
                             console.log('ERROR: writing ' + JSON.stringify(error));
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
                    console.log('cordova.file.externalRootDirectory: ' + cordova.file.externalRootDirectory);
                     fileDir = cordova.file.externalRootDirectory  ;
                     console.log('ANDROID FILEDIR: ' + fileDir);
                    
                }
                if (ionic.Platform.isIOS()) {
                    console.log('cordova.file.documentsDirectory: ' + cordova.file.documentsDirectory);
                    fileDir = cordova.file.documentsDirectory; 
                    console.log('IOS FILEDIR: ' + fileDir);
                }
         
                //now read the file 
                console.log('expected file location : ' +fileDir+bhookdbbackup ) ; 
                // check file exists, if not return the message in a popup 
                $cordovaFile.checkFile(fileDir,bhookdbbackup ).then(function(){
                 $cordovaFile.readAsText(fileDir,bhookdbbackup ).then(function(dumpedbased) {
                    console.log('read as text result : ' + dumpedbased) ;
                    bookService.restoreDatabase(dumpedbased).then(function (result) {
                        console.log('result returned ' + result ) ;
                        if(result == true){
                            console.log('apparently restored') ;
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
                            console.log('problem') ;
                            
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
                            console.log('problem') ;
                    
                } ) ;
                   

              

              
              
              
          });
              
              
          
        };


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
	console.log($scope.formBookAuthorText);
	//$scope.submitData.author = $scope.formBookAuthorText ;

});

