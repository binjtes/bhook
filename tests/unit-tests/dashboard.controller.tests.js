/* run : karma start unit-tests.conf.js*/

describe('bookService test', function(){
  var _db ;
  var _books ;
  var _booksbydate ;

    describe('when i call bookService initDB', function(){
      beforeEach(module('starter'));
      it('should instantiate return true ', inject(function(bookService) {
          expect( bookService.initDB ).toBeTruthy();
      }));

    });


});
