angular.module('bhook.services', [])
.factory('UserService', ['$q', function ($q) {
  // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
  //bp : i cant bother
  var setUser = function(user_data) {
    window.localStorage.starter_facebook_user = JSON.stringify(user_data);
  };

  var getUser = function(){
    return JSON.parse(window.localStorage.starter_facebook_user || '{}');
  };

  return {
    getUser: getUser,
    setUser: setUser
  };
 }])
.factory('settingsService', ['$q', function ($q) {
        var _dbsettings;
        return {
            initDB: function () {
                if (_dbsettings === undefined) {
                    _dbsettings = new PouchDB('bhooksettings', { adapter: 'websql' });
                }
            },
            setLanguage: function (language) {
                languageArr = {};
                languageArr._id = 'applanguage';
                languageArr.language = language;
                return $q.when(_dbsettings.get(languageArr._id, {conflicts: true})).then(function (updatelanguage) {
                    languageArr._rev = updatelanguage._rev ;
                        return $q.when(_dbsettings.put(languageArr)).then(function (addedlanguage) {
                            return addedlanguage;
                        }).catch(function (err) {
                            });    
                        // body...
                    }).catch(function (err) {
                        // the value is not set yet 
                        if(err.message == "missing"){
                               return $q.when(_dbsettings.put(languageArr)).then(function (addedlanguage) {
                                    return language;
                               }).catch(function (err) {
                                }); 
                        }
                    });                
          
            },
            getLanguage: function () {
                return $q.when(_dbsettings.get('applanguage', {})).then(function (setlanguage) {
                    return setlanguage.language;
                }).catch(function (err) {
                    // return default value ;
                    return 'en';
                });

            }
        };
    }])
    .factory('bookService', ['$q', '$window', bookService]);

function bookService($q, $window) { 
    var _db;

    var map = function (doc) {
        emit({ added: doc.added, author_lastname: doc.author_lastname, author_firstname: doc.author_firstname, book: doc.book, _id: doc._id, toread: doc.toread });
    };
    var mapAuthLastNameToRead = function (doc) {
        if (doc.toread !== false) {
            emit({ author_lastname : doc.author_lastname, author_firstname: doc.author_firstname, book: doc.book, added: doc.added,  _id: doc._id });
        }
    };
    var mapAuthLastNameRead = function (doc) { 
        if (doc.toread === false) {
            emit({ author_lastname : doc.author_lastname, author_firstname: doc.author_firstname, book: doc.book, added: doc.added,rate :doc.rate,comment: doc.comment, _id: doc._id });
        }
    };
    return {
        initDB: function (API_URL) {
            if (_db === undefined) {
                _db = new PouchDB('bhook', { adapter: 'websql' });
                // PouchDB.replicate('bhook', API_URL + '/bhook', {live: true});
                _db.info().then(function (info) {
                });


            } 
        },       
         getToRead: function (skip) {
           
            return $q.when(_db.query(mapAuthLastNameToRead , {
                descending: false,
                skip: skip,
                limit: 4
            }))
                .then(function (books) {
                    var booksbyauthorname;
                    booksbyauthorname = books.rows.map(function (row) {
                        return row.key;
                    });
                    return booksbyauthorname;
                   
                }).then(function(booksbyauthorname){
                     return booksbyauthorname;
                }).catch(function (err) {
                });
        },
        getAlreadyRead: function (skip) {
            return $q.when(_db.query(mapAuthLastNameRead, {
                descending: false,
                skip: skip,
                limit: 4
            })) 
                .then(function (books) {
                    var booksbyauthorname;
                    booksbyauthorname = books.rows.map(function (row) {
                        return row.key;
                    });

                    return booksbyauthorname;
                }).catch(function (err) {
                });
        },
        saveDatabase: function () {
            var MemoryStream = $window.memorystream;
            var stream = new MemoryStream();
            var dumpedString = '';
            stream.on('data', function (chunk) {
                dumpedString += chunk.toString();
            });
            return $q.when(_db.dump(stream)).then(function () {
                return dumpedString;
            }).catch(function (err) {
            }); 
 

        },
        restoreDatabase: function(dumpedstring){
            return $q.when(_db.load(dumpedstring)).then(function () {
                 // done loading!
                 return true ;
            }).catch(function (err) {
                return false ;
            });  
            
        }  ,  
        getLatestBooks: function (skip) {
              
            return $q.when(_db.query(map, {
                descending: true,
                skip: skip,
                limit: 4
            }))
                .then(function (books) {
                    var booksbydate;
                    booksbydate = books.rows.map(function (row) {
                        return row.key;
                    });
                    return booksbydate;
                }).catch(function (err) {
                });

        },


        /* unused  */
        getBook: function () {
            return $http.get(API_URL + '/book').then(function (resp) {
                return resp.data;
            }).catch(function (err) {
            });
        },
        deleteBook: function (idbbook) {
            return $q.when(_db.get(idbbook).then(function (doc) {
                return _db.remove(doc);
            }).catch(function (err) {
            })
                );
        },
        addBook: function (submitData) {
            return $q.when(_db.put(submitData)).then(function (addedbook) {
                return addedbook;
                // body...
            }).catch(function (err) {
            }); 
        },
       updateBook: function (submitData) {    
          return $q.when(_db.get(submitData._id, {conflicts: true})).then(function (updatedbook) {
               submitData._rev = updatedbook._rev
                return $q.when(_db.put(submitData)).then(function (updatedbook) {
                    return updatedbook;
                    }).catch(function (err) {
                    });    
                // body... 
            }).catch(function (err) {
            });
        }, 
        resetDb: function () {
            if (_db) {      
                return $q.when(_db.destroy()).then(function () {
                    return true ;
                }).catch(function (err) {
                    // error occurred
                });
            }else{
                return false ;
            }

        }
    };
}
