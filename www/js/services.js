angular.module('bhook.services',[])
.factory('bookService', ['$q', bookService  ]);

function bookService($q){
 var _db ;
 var _books ;
 var _booksbydate ;

 var map = function(doc){
   emit({added : doc.added , author_lastname: doc.author_lastname , author_firstname:doc.author_firstname, book:doc.book , _id:doc._id, toread:doc.toread});
 }
 var mapAuthLastName = function(doc){
   emit({author_lastname: doc.author_lastname , author_firstname:doc.author_firstname, book:doc.book ,added : doc.added ,  _id:doc._id, toread:doc.toread});
 }

  return {
	  initDB: function(API_URL){
		  if(_db == undefined){
	    	  console.log("instantiate DB locally and eventually " + API_URL);
	    	  _db = new PouchDB('bhook', {adapter: 'websql'});
		 	   //PouchDB.debug.enable('*');
	    	  PouchDB.debug.disable();
	    	  // PouchDB.replicate('bhook', API_URL + '/bhook', {live: true});
			 _db.info().then(function (info) {
					  console.log(info);
				})
			// document that tells PouchDB/CouchDB
			// to build up an index on doc.name
			var ddoc = {
			  _id: '_design/my_index',
			  views: {
			    by_name: {
			      map: function (doc) { emit(doc.author_lastname); }.toString()
			    },
			    by_date: {
				      map: function (doc) { emit(doc.added); }.toString()
				},
        by_toread: {
            map: function (doc) { emit(doc.toread); }.toString()
       }


			  }
			};
			// save it
			 _db.put(ddoc).then(function () {
			  // success!
				 console.log('index created') ;
			}).catch(function (err) {
				 console.log('index already created') ;
			  // some error (maybe a 409, because it already exists?)
			});

		  }
		} ,
		getLatestBooks: function(skip){
			return $q.when(_db.query( map ,{
        descending : true,
        skip: skip ,
        limit : 20
      }))
        .then(function(books) {
          console.log('entering query');
	    			console.log(books);
              console.log('**entering query');
	    			_booksbydate = books.rows.map(function(row) {
              console.log("row:");
              console.log(row);
	    				return row['key'];
	          });
            console.log(_booksbydate);
	          return _booksbydate;
	    	}).catch(function (err) {
	    		console.log(err);
	    	});


		},
    getBooksAlphabeticalOnAuthor: function(){
			return $q.when(_db.query( mapAuthLastName ,{
      }))
        .then(function(books) {
          console.log('entering query');
	    			console.log(books);
              console.log('**entering query');
	    			_booksbyauthorname = books.rows.map(function(row) {
              console.log("row:");
              console.log(row);
	    				return row['key'];
	          });
            console.log(_booksbydate);
	          return _booksbyauthorname;
	    	}).catch(function (err) {
	    		console.log(err);
	    	});


		},



		getAllBooks: function(){
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
    deleteBook: function(idbbook){
         _db.get(idbbook).then(function(doc) {
             _db.remove(doc);
         }).then(function (result) {
           // handle result
           return result;
         }).catch(function (err) {
           console.log(err);
         });
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
