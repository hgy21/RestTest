var ser = angular.module('restTestApp.services',[]);
ser.factory('transactionAPIService', function($http ){
  var transactions = {};
  transactions.getTransactions = function(id){
    return $http({
      method : 'GET',
      url: 'http://resttest.bench.co/transactions/'+id+'.json'
    })
  }
  return transactions;
})