(function(){

angular.module('app.utils', [])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    addObject: function(key1, key2, value){
      $window.localStorage[key1][key2] = value;
    },
    setSingleValue: function(k1, k2, v){
      $window.localStorage[k1][k2] = v;
    }
  }
}])

// utility functions
.factory("UTILS", function($sce){

  var UTILS = {

    // variables
    weekday : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    month : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],

    validateEmail : validateEmail,

    validateText : validateText,

    validateName : validateName,

    validateURL: validateURL,

    // validates both passwords
    validatePasswords : validatePasswords,

    // validates passowrs for splash page
    validatePasswordsSplash: validatePasswordsSplash,

    // validates single passsword
    validatePassword : validatePassword,

    validatePhone : validatePhone,

    validateNumber : validateNumber,

    processDate : processDate,

    getDate : getDate,

    checkBlank: checkBlank,

    capFirst: capFirst,

    checkFile: checkFile,

    isInteger: isInteger,

  };
  return UTILS;

  function isInteger(n){
    return (!(typeof n !== "number" || isNaN(n) || (n%1!==0)));   
  }

  // function to validate email : returns boolean value
  function validateEmail(email){
    regex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/igm;
    return regex.test(email);
  }

  function checkFile(fileId, name, ext, alert_flag){
              var f = document.getElementById(fileId);
              var fname = document.getElementById(fileId).value;
              //console.info('file', document.getElementById(fileId).value);
              //console.info('fname', fname);

              if(!f){
                  if(alert_flag){
                      alert("Please upload a " + name + " file for the Cube26 store!");    
                  }                    
                  return false;
              }
              // check is ext is an array
              else if(Array.isArray(ext)){
                  var fext = fname.split('.')[fname.split('.').length - 1].toLowerCase();
                  var r = function(){
                      var result = false;
                      for(var i=0; i<ext.length; i++){
                          if(ext[i]===fext){
                              result = true;
                              break;
                          }
                      }
                      return result;
                  }();

                  if(r){
                      return true;
                  }
                  else{
                      if(alert_flag){
                          alert("Please upload a valid extension(" + ext + ") for " + name + "!");    
                      }                     
                      return false;
                  }
              }
              // check for single extension case
              // for legacy code
              else if(typeof ext === "string"){
                  var fext = fname.split('.')[fname.split('.').length - 1].toLowerCase();
                  //console.info('ext', ext);
                  //console.info('fext', fext);
                  if(fext===ext){
                      return true;
                  }
                  else{
                      if(alert_flag){
                          alert("Please upload a valid extension(" + ext + ") for " + name + "!");    
                      }                     
                      return false;
                  }
              }
              else if (!ext){
                  return true;
              }
          }

  // function to validate if a string : return boolean
  function validateText(text){
    // blank check
    if (UTILS.checkBlank(text)){
      return false;
    }
    else
    {
      if(text === undefined || text.length === 0 || text === " " || text==="")
        return false
      else return true;
    }
  }

  // function to validate if a string : return boolean
  function validateName(text){

    // blank check
    if (UTILS.checkBlank(text)){
      return false;
    }
    else
    {
      if(text === undefined || text.length < 2 || text === " ")
        return false
      else return true;
    }
  }

  // function to validate url
  function validateURL(url){

    if (!url) return false;
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);    
    if (url.match(regex)){
      return true;
    }
    else{
      return false;
     }
  }

  // function to validate password : return boolean
  function validatePassword(text){

    // blank check
    if (UTILS.checkBlank(text)){
      return false;
    }
    else
    {
      if(text === undefined || text.length < 6 || text === " ")
        return false
      else return true;
    }
  }


  // function to validate a 10 digit phone number : returns boolean
  function validatePhone(phone){
    regex = /^\d{10}$/
    return regex.test(phone);
  }

  // function to validate passwords length and check if passwords match
  // returns 0 if length is less than 6
  // return 1 if passwords do not match
  // returns 2 if passwords are valid
  function validatePasswords(p1, p2){

    // blank p1
    if (UTILS.validate_text(p1)){
      return -1;
    }

    //blank p2
    if (UTILS.validate_text(p1)){
      return -2;
    }

    // check passwords length
    if(p1.length < 6){
      return 0;
    }

    // check if passwords match
    if(p1.length === p2.length && p1 === p2){
      return 2;
    }
    else{
      return 1;
    }
  }

  // function to validate passwords length and check if passwords match, for splash validation
  function validatePasswordsSplash(p1, p2){

    // blank checks
    if (UTILS.checkBlank(p1) || UTILS.checkBlank(p2)){
      return false;
    }

    // check passwords length
    if(p1.length < 6 || p2.length < 6){
      return false;
    }

    // check if passwords match
    if(p1.length === p2.length && p1 === p2){
      return true;
    }
    else{
      return false;
    }
  }

  // function to validate if a entry is an integer : return boolean
  function validateNumber(number){
    number = parseInt(number, 10);    
    if(number === undefined || !(typeof number === 'number')){
      return false;
    }
    else return true;
  }

  // receives pythonic date and converts to displayable date
  function processDate(date){
    date = (date.slice(0,10)).split("-");
    date = new Date(date);
    var date_string = String(o.month[parseInt(date.getMonth())]) + " " + String(date.getDate()) + ", " + String(date.getFullYear());

    return date_string;

  }

  // check blank
  // return true if blank found
  function checkBlank(obj){
    if (obj === undefined || obj === null || obj === ""){
      return true;
    }
    else return false;
  }

  // function to get day, date, month in a list
  function getDate(){

    var d = new Date();

    var n = o.weekday[d.getDay()];
    var m = o.month[d.getMonth()];

    return [ n, d.getDate(), m];
  }

  // function that capitalises first letter of a string
  function capFirst(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
  } 

})

// filter to capfirst text
.filter('capfirst', function() {
    return function(input, scope) {
      if (input == undefined || input == null)
        return;
        return input.substring(0,1).toUpperCase()+input.substring(1);
      }
})

// returns trusted url
.filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}])

// log factory for debugging
.factory("LOG", function(DEBUG){

  var obj = {
    debug : DEBUG.Value,

    log : function(str){
      if (obj.debug){
        console.log(str);
      }
    }
  };

  return obj;

})

;

})();