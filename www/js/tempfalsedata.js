/*var book1 = {
  _id : "andersen-hans-christian-contes",
  author_firstname: "Hans Christian",
  author_lastname: "Andersen",
  book: "Contes" ,
  added:  "2015-12-13T17:33:02.276Z",
  toread : true } ;
  bookService.addBook(book1) ;
  var book2 = {
    _id : "chinua-achebe-le-monde-s-effondre",
    author_firstname: "Chinua",
    author_lastname: "Achebe",
    book: "Le monde s'effondre" ,
    added:  new Date() ,
    toread : true } ;

   bookService.addBook(book2) ;

 var book3 = {
   _id : "jane-austen-orgueil-et-prejuges",
   author_firstname: "Jane",
   author_lastname: "Austen",
   book: "Orgueil et Préjugés" ,
   added:  new Date() ,
   toread : true } ;

  bookService.addBook(book3) ;


var book4 = {
  _id : "honore-de-balzac-le-pere-goriot",
  author_firstname: "Honoré de",
  author_lastname: "Balzac",
  book: "Le Père Goriot" ,
  added:  new Date() ,
  toread : true } ;

 bookService.addBook(book4) ;


var book5 = {
 _id : "boccace-decameron",
 author_firstname: "",
 author_lastname: "Boccace",
 book: "Décaméron" ,
 added:  new Date() ,
 toread : false
} ;
bookService.addBook(book5) ;


/* not working tests on controller how the hell is it supposed to work ?
describe('modalauth ionicModal Tests', function(){
  beforeEach(function(){
    //create a mock of the service (step 1)
    var ionicModalMock = jasmine.createSpyObj('$ionicModal', ['fromTemplateUrl']);
    //create an example response which just calls your callback (step2)
    var successCallback = {
       then: function(callback){
           callback.apply(arguments);
       }
    };
      ionicModalMock.fromTemplateUrl.and.returnValue(successCallback);
  });
  it('should open modalauth modal ', function() {
       deferredBook.resolve();
       $scope.$digest();
       expect(ionicModalMock.fromTemplateUrl).toHaveBeenCalled();
       expect(ionicModalMock.fromTemplateUrl.calls.count()).toBe(1); // OK
  });


});



*/
