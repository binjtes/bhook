angular.module('bhook.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

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
	  $scope.modalauth.hide();
	  console.log($scope.submitData);

	  $http.post(API_URL+'/add', $scope.submitData ).then(function(resp) {
		   // treat ok response by adding to list 
		  
		  
		  
		  
		  
		  }, function(err) {
		    console.error('ERR', err);
		   
		 })
	 
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
  


  // Perform the login action when the user submits the login form
//  $scope.doLogin = function() {
//    console.log('Doing login', $scope.loginData);
//
//    // Simulate a login delay. Remove this and replace with your login
//    // code if using a login system
//    $timeout(function() {
//      $scope.closeLogin();
//    }, 1000);
//  };
})
.controller('DashboardCtrl', function($scope,$http ,API_URL) {
	
	  $http.get(API_URL+'/book').then(function(resp) {
		    $scope.latestbooks = resp.data;
		  }, function(err) {
		    console.error('ERR', err);
		   
		 })
	
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
