(function() {
  'use strict';
  
  // initialize headroom
  var myElement = document.querySelector("nav");
  var headroom = new Headroom(myElement, {
	  tolerance: 5,
	  offset: 0
	});
  headroom.init();

})();