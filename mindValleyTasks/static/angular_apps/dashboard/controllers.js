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
    		    	

    	}
    ])

    .controller("cvUploaderController",[
        "$scope", 
        "cvService",
        function($scope, cvService){

            $scope.form = {
                name: null,
                dob: null,
                emailID: null,
                linkedInUrl: null,
                soUrl: null,
                githubUrl: null,
                qualifications: [],
                workExp: [],
                projects: [],
                interests: [],
            };

            (function init(){
                $scope.cvJson = null;
                $scope.uploaderState = 0;
                $scope.cvObject = null;    
            })();

            

            $scope.submit = function(){     
                $scope.uploaderState = 1;         
                try{
                    var json = JSON.parse($scope.cvJson);    
                }
                catch(err){
                    alert("Please enter a valid JSON!\n\n", err);
                    return;
                }  
                
                if(json){
                    cvService.uploadCV(json)
                    .then(function(resolve){
                        console.log(resolve);
                        $scope.cvObject = resolve[0];
                        $scope.uploaderState = 2;
                    }, function(reject){
                        console.error(reject);
                        $scope.uploaderState = 0;
                    });
                }
                else{
                    alert("Please enter a valid JSON!");
                }
            }

            $scope.reset = function(){
                $scope.cvJson = null;
                $socpe.uploaderState = 0;
                $scope.cvObject = null;
            }

        }
    ])

;})();