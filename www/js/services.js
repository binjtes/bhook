angular.module('bhook.services',[])
.factory('bookService', ['$q', bookService  ]);

function bookService($q){
 var _db ;
 var _books ;
  return {
		initDB: function(API_URL){
      if(_db == undefined){
      console.log("instantiate DB locally and eventually " + API_URL);
			_db = new PouchDB('bhook', {adapter: 'websql'});
	 	  //	PouchDB.debug.enable('*');
      PouchDB.debug.disable();
      // PouchDB.replicate('bhook', API_URL + '/bhook', {live: true});

				_db.info().then(function (info) {
				  console.log(info);
				})
        }
		} ,
    getLatestBooks: function(){
    var options =   {descending : true,include_docs: true } ;
      return $q.when(_db.allDocs(options))
      .then(function(books) {
        console.log(books);
        _books = books.rows.map(function(row) {
          return row['doc'];
          });
          return _books;
     }).catch(function (err) {
      console.log(err);
    });

    },
		getBooks: function(){
				if (!_books) {
					return $q.when(_db.allDocs({ include_docs: true}))
	        .then(function(books) {
						console.log(books);
						_books = books.rows.map(function(row) {
              return row['doc'];
              });
							return _books;
				 }).catch(function (err) {
				  console.log(err);
				});
				;

		} else {
        // Return cached data as a promise
        return $q.when(_books);
    }
	},

   getBooksWishList: function(){
         if (!_books) {
           return $q.when(_db.allDocs({ include_docs: true}))
           .then(function(books) {
             console.log(books);
             _books = books.rows.map(function(row) {
               return row['doc'];
               });
               return _books;
          }).catch(function (err) {
           console.log(err);
         });

         ;

     } else {
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
				return $q.when(_db.put(submitData));

		},
    resetDb : function(){
      if(_db){
        console.log("destroy");
        _db.destroy().then(function(){
        }).catch(function (err) {
          // error occurred
            console.log("err" + err);
        })
      }

    }
	}
}
