angular.module('bhook.controllers', ['bhook.services'])
.controller('DashboardCtrl', function($scope,$http ,API_URL, bookService ) {

	// TODO : http://ionicframework.com/docs/api/directive/ionRefresher/ ? http://blog.ionic.io/pull-to-refresh-directive/
	 // populate latest book
	  $scope.$on('$ionicView.enter', function(e) {
			console.log("$ionicView.enter") ;
		   //Refresh list TODO : avoid new request, store the info somehow
			bookService.getBooks().then(function(books){
		    	 $scope.latestbooks = books ;
		    	console.log("refresh list books ? ") ;
		    	 console.log($scope.latestbooks) ;


		    });
	  });



//  $scope.latestbooks = [
//	                  { title: 'Les liaisons extaordinaires' , author:'Michale henekisq', resume:'Lipsem' , thumbnail:'img/img1.jpg'},
//	                  { title: 'Eat mushrooms', author:'Michale henekisq', resume:'Lipsem' , thumbnail:'img/img1.jpg'},
//	                  { title: 'Get high enough to grab the flag', author:'Michale henekisq', resume:'Lipsem' , thumbnail:'img/img1.jpg'},
//	                  { title: 'Find the Princess' , author:'Michale henekisq', resume:'Lipsem' , thumbnail:'img/img1.jpg'},
//	                ];

		  $scope.formBookAuthorText = 'Add a book or author' ;
		 // addbook click
		 $scope.addBook = function(){
			 // remove actual text from the input .
			 $scope.formBookAuthorText = null;
	  	};

	  	$scope.submitAddBook = function(formBookAuthorText){
	  		// show a modal dialog window to make final choice of ath/book book/auth surn/first, etc ..
	  		$scope.openAuthBookModal(formBookAuthorText);

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
  $scope.submitData= {};


  // Create the auth/book distinction modal that is used before the insertion of data
  $ionicModal.fromTemplateUrl('templates/addauthbookmodal.html',function($ionicModal) {
	    $scope.modalauthbook = $ionicModal;
  }, {
    scope: $scope
  }).then(function(modalauthbook) {
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


  // close the AuthBook modal
  $scope.closeAuthBookModal=  function(){
	  $scope.modalauthbook.hide();
  }

  // prepare author data
  $scope.prepareAuthData = function(){
	  $scope.modalauthbook.hide();
	  // we need the firstname/lastname distinction for an author
	  $scope.openAuthModal($scope.submitData.author);
  }


  // submitAuthBook
  $scope.submitAuthBook = function(){


	 //  Object {book: "dqd", author_firstname: "sqsq", author_lastname: "" }


	  // remove unecessary fields
	  delete  $scope.submitData.author ;
	  // add timestamp
	  $scope.submitData['added'] = new Date();
	  console.log($scope.submitData) ;
	  //add the book
	  bookService.addBook($scope.submitData).then(function(book){

		  $scope.modalauth.hide();
	  });




  }




  // move text between input text to make author/book distinct before commit
  $scope.movetext= function(authoronly){

	  if(authoronly){

		    // clean up double spaces, empty values
		    $scope.submitData.author_firstname = $scope.submitData.author_firstname.split(/[\s+]+/gm).filter(Boolean).join(" ");
		    $scope.submitData.author_lastname = $scope.submitData.author_lastname.split(/[\s+]+/gm).filter(Boolean).join(" ");
		    // count number of words
		    var firstnameln = $scope.submitData.author_firstname.split(/[\s+]+/gm).length ;
		    var lastnameln = $scope.submitData.author_lastname.split(/[\s+]+/gm).length ;
		    // additional filter
		    var fnarr = $scope.submitData.author_firstname.split(/[\s+]+/gm).filter(Boolean);
		    var lnarr = $scope.submitData.author_lastname.split(/[\s+]+/gm).filter(Boolean);
	        if (fnarr.length  > 0 &&  $scope.sensetogo == "right") {
	        	lnarr.unshift(fnarr[fnarr.length - 1]);
	        	fnarr.pop();
	        } else {
	             $scope.sensetogo = "left";
	            if (lnarr.length  > 0 &&  $scope.sensetogo == "left") {
	            	 fnarr.unshift(lnarr[lnarr.length - 1]);
	            	 lnarr.pop();

	            }else{
	             $scope.sensetogo = "right";
	            }
	        }
	        firstnameln = fnarr.length ;
	        lastnameln = lnarr.length ;
	        // restitute input value
	        $scope.submitData.author_firstname = fnarr.join(" ");
	        $scope.submitData.author_lastname = lnarr.join(" ");
	        // change arrow direction
	        if(firstnameln == 0 ){
	        	$scope.arrowDirectionClass = "ion-arrow-up-c";
	        }
	        if(lastnameln ==0 ){
	        	$scope.arrowDirectionClass = "ion-arrow-down-c";
	        }



		  return ;
	  }

	    // clean up double spaces, empty values
	    $scope.submitData.author = $scope.submitData.author.split(/[\s+]+/gm).filter(Boolean).join(" ");
	    $scope.submitData.book = $scope.submitData.book.split(/[\s+]+/gm).filter(Boolean).join(" ");
	    // count number of words
	    var authorln = $scope.submitData.author.split(/[\s+]+/gm).length ;
	    var bookln = $scope.submitData.book.split(/[\s+]+/gm).length ;
	    // additional filter
	    var autharr = $scope.submitData.author.split(/[\s+]+/gm).filter(Boolean);
	    var bookarr = $scope.submitData.book.split(/[\s+]+/gm).filter(Boolean);
        if (autharr.length  > 0 &&  $scope.sensetogo == "right") {
            bookarr.unshift(autharr[autharr.length - 1]);
            autharr.pop();
        } else {
             $scope.sensetogo = "left";
            if (bookarr.length  > 0 &&  $scope.sensetogo == "left") {
                autharr.unshift(bookarr[bookarr.length - 1]);
                bookarr.pop();

            }else{
             $scope.sensetogo = "right";
            }
        }
        authorln = autharr.length ;
        bookln = bookarr.length ;
        // restitute input value
        $scope.submitData.author = autharr.join(" ");
        $scope.submitData.book = bookarr.join(" ");
        // change arrow direction
        if(authorln==0 ){
        	$scope.arrowDirectionClass = "ion-arrow-up-c";
        }
        if(bookln==0 ){
        	$scope.arrowDirectionClass = "ion-arrow-down-c";
        }


  };

  // open the AuthBookModal
  $scope.openAuthBookModal=  function(formBookAuthorText){
	  $scope.modalauthbook.show();
	  $scope.arrowDirectionClass = "ion-arrow-down-c";
	  $scope.sensetogo = "right"
	  $scope.submitData.author= formBookAuthorText.split(/[\s+]+/gm).filter(Boolean).join(" "); ;
	  $scope.submitData.book = "" ;



  }

  // open the AuthModal
  $scope.openAuthModal=  function(scopesubmitDataauthor){
	  $scope.modalauth.show();
	  $scope.arrowDirectionClass = "ion-arrow-down-c";
	  $scope.sensetogo = "right" ;
	  $scope.submitData.author_firstname = scopesubmitDataauthor.split(/[\s+]+/gm).filter(Boolean).join(" "); ;
	  $scope.submitData.author_lastname = "" ;



  }



})
.controller('addauthbookCtrl', function($scope) {
	console.log($scope.formBookAuthorText);
	//$scope.submitData.author = $scope.formBookAuthorText ;

})
.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
