angular.module('bhook.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})
.controller('DashboardCtrl', function($scope,$http ,$apiUrl) {
	  $http.get($apiUrl+'/book').then(function(resp) {
		    $scope.latestbooks = resp.data;
		  }, function(err) {
		    console.error('ERR', err);
		    // err.status will contain the status code
		 })
	
//	               	  $scope.latestbooks = [
//	               		                  { title: 'Les liaisons extaordinaires' , author:'Michale henekisq', resume:'Lipsem' , thumbnail:'img/img1.jpg'},
//	               		                  { title: 'Eat mushrooms', author:'Michale henekisq', resume:'Lipsem' , thumbnail:'img/img1.jpg'},
//	               		                  { title: 'Get high enough to grab the flag', author:'Michale henekisq', resume:'Lipsem' , thumbnail:'img/img1.jpg'},
//	               		                  { title: 'Find the Princess' , author:'Michale henekisq', resume:'Lipsem' , thumbnail:'img/img1.jpg'},
//	               		                ];
	
	
	
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
