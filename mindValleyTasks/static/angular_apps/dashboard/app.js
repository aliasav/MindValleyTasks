/* web module is defined here */
/* Define all states here using angular-ui router */
/* Do not define any controllers/services/utilities here, all controllers/services/utilities must go in their specific modules */

(function(){
    
    angular

    .module('app', [
        'app.controllers',
        'app.services',
        'app.utils',
        'app.filters',
        'ngCookies',
        'ui.router',
    ])

    // Changing interpolation start/end symbols.
    .config(function($interpolateProvider, $httpProvider){
        
        $interpolateProvider.startSymbol('[[').endSymbol(']]');
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        //$httpProvider.defaults.headers.post['Content-Type'] = undefined;
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    })

    // CSRF token setting
    .run(function($http, $cookies){
        
        $http.defaults.headers.common['X-CSRFToken'] = $cookies['csrftoken'];
        $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
    })

    .config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
        $urlRouterProvider.otherwise('/dashboard/home');

        $stateProvider
        .state('dashboard', {
            url:'/dashboard',
            templateUrl: '/static/angular_apps/dashboard/views/base.html', 
            abstract: true,           
        })
        .state('dashboard.home',{
            url:'/home',
            controller: 'homeController',
            templateUrl:'/static/angular_apps/dashboard/views/home.html',            
        })
        .state('dashboard.cvUploader',{
            url:'/upload-cv',
            controller: 'cvUploaderController',
            templateUrl:'/static/angular_apps/dashboard/views/cvUploader.html',            
        })
        .state('dashboard.ticTacToe',{
            url:'/tic-tac-toe',
            controller: 'ticTacToeController',
            templateUrl:'/static/angular_apps/dashboard/views/ticTacToe.html',            
        })
        .state('dashboard.ticTacToe2',{
            url:'/tic-tac-toe2',
            controller: 'ticTacToeController2',
            templateUrl:'/static/angular_apps/dashboard/views/ticTacToe2.html',            
        })
        .state('dashboard.urlShortner', {
            url: '/url-shortner',
            controller: 'urlShortnerController',
            templateUrl:'/static/angular_apps/dashboard/views/urlShortner.html',
        })

    }])


    // urls with constant SERVER are used, by default set to development urls
    // changed to production urls while ansible deployment

    // Add development/testing/staging server domains
    // do not modify these patterns
    // if modifying, also make corresponding changes in app_js_settings.sh in ops as well
    .constant("DOMAIN", {
        server: "http://127.0.0.1:8000/", // local
        server1: "http:///", // production


    })

    // DO NOT hard code these urls anywhere in the project
    .constant("API_URLS", {
        uploadCV: "api/cv_parser/post/",
    })

;})();
