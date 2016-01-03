angular.module('bhook.controllers', ['bhook.services','bhook.directives'])
.controller('DashboardCtrl', function($scope,$http ,API_URL, bookService,$ionicModal,$translate ) {
	 bookService.initDB(API_URL);

	 //data to populate a book object
	 $scope.submitData= {};
	 // other data values binded into controller
	 $scope.data= {};

	 $scope.data.formBookAuthorText = $translate.instant("add_a_book") ;
  // $scope.data.formBookAuthorText = $translate.instant("add_a_book") ;
	 // the first skip for the latest book list is the first 8 already called by default
	 // purpose :TODO infinite scrolling
	 $scope.latestbooksSkip = 0;
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
	 // opens a modal dialog window to sort values b/n  auth/book book/auth surn/firstname, to read true/false ..
	 $scope.openModalAuthBook = function(){
		 $scope.modalauthbook.show();
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
			// build the id using alphabetical order
			$scope.submitData['_id'] = $scope.submitData['author_lastname']+'-'+$scope.submitData['author_firstname']+'-'+$scope.submitData['book'].toLowerCase();
			 // the id is the author name plus
	 		console.log($scope.submitData) ;
	 		//add the book
	 		bookService.addBook($scope.submitData).then(function(book){
				  $scope.latestbooks.unshift($scope.submitData) ;
					$scope.modalauth.hide();
					console.log($scope.data.formBookAuthorText) ;
					$scope.data.formBookAuthorText = $translate.instant("add_a_book") ;
					// erg .. does not refresh ?
					console.log($scope.data.formBookAuthorText) ;
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

	// TODO implement : http://ionicframework.com/docs/api/directive/ionRefresher/ ? http://blog.ionic.io/pull-to-refresh-directive/
	 // populate latest book
		$scope.$on('$ionicView.enter', function(e) {
			console.log("$ionicView.enter") ;
			//debuggin directive
			$scope.openModalAuthBook();


			 //Refresh list when entering the view, an item can have been updated/deleted in another controller
			 bookService.getLatestBooks().then(function(bookssortedbydate){
	 				$scope.latestbooks = bookssortedbydate ;
	 				 console.log(bookssortedbydate);
	 		 });
 		});

		 // addbook click - beginning of the input
		 $scope.addBook = function(){
			 // remove actual text from the input .
			 $scope.data.formBookAuthorText = null;

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


		$scope.$on('$ionicView.enter', function(e) {
				bookService.getBooksAlphabeticalOnAuthor().then(function(books){
						 $scope.wishlist = books ;
						 console.log(books) ;
					}).catch(function (err){
							console.log(err);
					});
		});


		$scope.deleteBook = function(index){
			bookService.deleteBook($scope.wishlist[index]['_id']).then(function(book){
				console.log(book);
				$scope.wishlist.splice(index, 1);

			});


		}




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
