// This filter is used for clean up company names
angular.module('restTestAppFilters',[])
.filter('cleanName',function(){
  return function(input){
    var output;
    output = input.replace(/[^A-Z.]+/g, ' ');
    return output;
  }
})