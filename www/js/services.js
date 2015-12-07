angular.module('bhook.services',[])
.factory('bookService', function($http, API_URL) {
	return {
		getBooks: function(){
			  return $http.get(API_URL+'/book').then(function(resp) {
				    return resp.data; 
				  }, function(err) {
				    console.error('ERR', err);
				   
				 })
		},
		getBook: function(){
			  return $http.get(API_URL+'/book').then(function(resp) {
				    return resp.data; 
				  }, function(err) {
				    console.error('ERR', err);
				   
				 })
			
			
		},
		addBook: function(submitData){
			return $http.post(API_URL+'/addbook', submitData ).then(function(resp) {
					
				
				
			}, function(err) {
				    console.error('ERR', err);
				   
			})
		}
	}
})