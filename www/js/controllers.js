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
  // Create the login modal that we will use later
//  $ionicModal.fromTemplateUrl('templates/login.html', {
//    scope: $scope
//  }).then(function(modal) {
//    $scope.modal = modal;
//  });
  
  // Create the auth/book distinction modal that is used for the insertion of data 
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/addauthbookmodal.html',function($ionicModal) {
	    $scope.modal = $ionicModal;
  }, {
    scope: $scope
  }).then(function(modalauthbook) {
    $scope.modalauthbook = modalauthbook;
  });
   
  
  // close the AuthBook modal 
  $scope.closeAuthBookModal=  function(){
	  $scope.modalauthbook.hide();
  }
  
  // submitAuthBook
  $scope.submitAuthBook = function(){
	  $scope.modalauthbook.hide(); 
	  
	  
	 //  $scope.latestbooks.unshift({'title' : $scope.submitData.book}) ;
	  /*
	  $http.post(API_URL+'/add', $scope.submitData  ).then(function(resp) {
		   // treat ok response by adding to list 
		  
		  
		  
		  }, function(err) {
		    console.error('ERR', err);
		   
		 })
	  */
	 
  }
  
  // move text between input text to make author/book distinct before commit 
  $scope.movetext= function(){ 
	    // clean up double spaces, empty values 
	    $scope.submitData.author = $scope.submitData.author.split(/[\s+]+/gm).filter(Boolean).join(" ");
	    $scope.submitData.book = $scope.submitData.book.split(/[\s+]+/gm).filter(Boolean).join(" ");
	    $scope.authorln = $scope.submitData.author.split(/[\s+]+/gm).length ;
	    $scope.bookln = $scope.submitData.book.split(/[\s+]+/gm).length ;
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
        $scope.authorln = autharr.length ;
        $scope.bookln = bookarr.length ;
        // restitute input value 
        $scope.submitData.author = autharr.join(" ");
        $scope.submitData.book = bookarr.join(" ");
        // change arrow direction 
        if($scope.authorln ==0 ){
        	$scope.arrowDirectionClass = "ion-arrow-up-c";
        }
        if($scope.bookln ==0 ){
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
