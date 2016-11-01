
/* All services go here */
/* Kindly Keep code modular */
/* Use utlities whenever required */
/* Refactor code after writing modules */

/* 
A word on structuring your Factories/Services:

	For factories/service, declare all objects and methods in a variable of the service/factory name, referencing functions within
	the factory/service. This taken advantage of the function scope in Javascript and allows factory/service methods to be used
	in other factory/service methods. 
*/

(function(){

angular.module('app.services', [])
	
	.directive('cvViewer', function(){
	  	return {
	    	restrict: 'E',
	    	scope: {
	    		cvObject: "=cvObject", 	    		
	    	},
	    	templateUrl: "../views/cvViewer.html",
	    	controller: function ($scope){
	    		
	    	},	    	
	  	};

	})

	.factory('cvService', function($http, DOMAIN, API_URLS, $q){
		var service = {
			uploadCV: uploadCV,
		};

		function uploadCV(data){
			var defer = $q.defer();
			var url = DOMAIN.server + API_URLS.uploadCV;
			$http.post(url, data)
			.success(function(data, status, headers, config){
				defer.resolve([data, status]);
			})
			.error(function(data, status, headers, config){
				defer.reject([data, status]);
			});

			return defer.promise;
		}

		return service;
	})

})();