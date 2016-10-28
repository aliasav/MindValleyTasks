/* All controllers go in this file */
/* Keep controllers as slim as possible */
/* Separate out as much as possible and include make services out of them. */ 
/* Naming convention for controllers: 'nameController'. A standard convention will make it easier to search for required controllers. */

(function(){

    angular.module('app.controllers', [
        'app.services',
        'app.utils',        
    ])
    
    // home (dashboard) controller
    .controller("homeController", [
    	"$scope",    	
    	function(
    		$scope
    	){    	
    		    	

    	}])

;})();