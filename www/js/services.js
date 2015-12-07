angular.module('bhook.services',[])
.factory('bookService', ['$q', bookService ]);

function bookService($q){
 var _db ;
 var _books ;
  return {
		initDB: function(){
			_db = new PouchDB('bhook', {adapter: 'websql'});
			PouchDB.debug.enable('*');
				console.log(_db) ;
				_db.info().then(function (info) {
				  console.log(info);
				})
		} ,
		getBooks: function(){

				if (!_books) {
					return $q.when(_db.allDocs({ include_docs: true}))
	        .then(function(books) {
						console.log(books);
						_books = books.rows.map(function(row) {
              console.log('la :' +row['doc']['author_firstname']);
              return row['doc'];
              });
							return _books;
				 }).catch(function (err) {
				  console.log(err);
				});

				;

		} else {
			  console.log('ici ' +_books);
        // Return cached data as a promise
        return $q.when(_books);
    }
	},
		getBook: function(){
			  return $http.get(API_URL+'/book').then(function(resp) {
				    return resp.data;
				  }, function(err) {
				    console.error('ERR', err);

				 })
		},
		addBook: function(submitData){
				console.log("about to submit ")
				return $q.when(_db.post(submitData));

		}
	}
}
