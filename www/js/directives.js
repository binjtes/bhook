angular.module('bhook.directives',[]);
angular.module('bhook.directives').directive('distributeInput', function (){
return{
    restrict :'A',
    scope: false,
    link: function(scope, element, attrs){
 
      scope.toggleAdditionalForm = function toggleAdditionalForm(){
        console.log(scope.submitData.toread);

      }; 
      scope.movetext = function movetext(authoronly){
        if(authoronly){
     				// additional filter
     				var fnarr = scope.submitData.author_firstname.split(/[\s+]+/gm).filter(Boolean);
     				var lnarr = scope.submitData.author_lastname.split(/[\s+]+/gm).filter(Boolean);
   					if (fnarr.length	> 0 &&	scope.sensetogo == "right") {
   						lnarr.unshift(fnarr[fnarr.length - 1]);
   						fnarr.pop();
   					} else {
                scope.sensetogo = "left";
   							if (lnarr.length	> 0 &&	scope.sensetogo === "left") {
   								 fnarr.unshift(lnarr[lnarr.length - 1]);
   								 lnarr.pop();
   							}else{
   							  scope.sensetogo = "right";
   							}
   					}
   					// restitute input value
   					scope.submitData.author_firstname = fnarr.join(" ");
   					scope.submitData.author_lastname = lnarr.join(" ");
   					// change arrow direction
   					if(fnarr.length === 0 ){
   						scope.arrowDirectionClass = "ion-arrow-up-c";
   					}
   					if(lnarr.length === 0 ){
                scope.arrowDirectionClass = "ion-arrow-down-c";
   					}
     			return ;
     		}

   			var autharr = scope.submitData.author.split(/[\s+]+/gm).filter(Boolean);
   			var bookarr = scope.submitData.book.split(/[\s+]+/gm).filter(Boolean);
  			if (autharr.length	> 0 &&	scope.sensetogo == "right") {
  						 bookarr.unshift(autharr[autharr.length - 1]);
  						 autharr.pop();
  		  } else {
							scope.sensetogo = "left";
						 if (bookarr.length	> 0 &&	scope.sensetogo == "left") {
								 autharr.unshift(bookarr[bookarr.length - 1]);
								 bookarr.pop();
						 }else{
							scope.sensetogo = "right";
						 }
				 }
				 // restitute input value
				 scope.submitData.author = autharr.join(" ");
				 scope.submitData.book = bookarr.join(" ");
				 // change arrow direction
				 if(autharr.length === 0 ){
				 	scope.arrowDirectionClass = "ion-arrow-up-c";
				 }
				 if(bookarr.length === 0 ){
           scope.arrowDirectionClass = "ion-arrow-down-c";
				 }
      };
    }
  };

});
