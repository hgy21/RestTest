var appCtrs = angular.module('restTestApp.controllers',[]);

appCtrs.controller('transactionController', function($scope, transactionAPIService){

  var pageNumber = 1 // starting from page 1 
  updateTable(); // initial table update

  // nextPage btn
  $scope.nextPage = function(){
    pageNumber++;
    updateTable('next');
  };

  // prevPage btn
  $scope.prevPage = function(){
    pageNumber--;
    updateTable('prev');
  };

  // fetch the current JSON file based on the page#, and update all data
  function updateTable(action){
    transactionAPIService.getTransactions(pageNumber)
    .success(function(response){
      console.log(response);
      $scope.totalTransactionCount = response.totalCount;
      $scope.pageNumber = response.page;
      console.log(calcDailyAmount(response.transactions));
      $scope.categories = categorizeTransaction(response.transactions);
      $scope.dailyTotal = calcDailyAmount(response.transactions);
      $scope.transactions = markDuplicates(response.transactions);
      $scope.pageTotal = sum(response.transactions).toFixed(2);
    })
    .catch(function(err){
      action === 'next'? pageNumber--:pageNumber++;
    })};
  })

// calculate the sum of the transactions
function sum(list){
 var total = 0;
 for(var i in list){ total += parseFloat(list[i].Amount);}
  return total;
}

// finds duplicated entries and attach "----------- ( Warning: Duplicated Trasaction)" at the end of the Ledger 
function markDuplicates(input){
  var list = input;
  var lastObj = input[0]; 
  for (var i = 1; i<list.length; i++){
    var currentObj = list[i];
    if(currentObj.Date == lastObj.Date && currentObj.Amount == lastObj.Amount && currentObj.Compnay == lastObj.Compnay &&  currentObj.Date == lastObj.Date ){
      lastObj.Ledger += "----------- ( Warning: Duplicated Trasaction)";
      currentObj.Ledger += "----------- ( Warning: Duplicated Trasaction)";
    }
    lastObj = currentObj;
  }  
  return list
}

// return a new list in a format of {name:xxx, totalAmout: xxx, transactions: Array[]} 
function categorizeTransaction(input){
  var list = input;
  var newList = [];
  for(var i in list){
    var category;
    list[i].Ledger == ''?(category='Payment'):(category = list[i].Ledger);
    var catergoryIndex = getIndex(category, newList)
    if( catergoryIndex == -1){
      var transactionList = [];
      transactionList.push(list[i]);
      var newObj = {name:category, totalAmount:list[i].Amount ,transactions: transactionList};
      newList.push(newObj);
    }else{
      newList[catergoryIndex].transactions.push(list[i]); 
      newList[catergoryIndex].totalAmount = parseFloat(newList[catergoryIndex].totalAmount) + parseFloat(list[i].Amount);
    }
  }
  return newList; 
} 

// a function returns the index of  a value in a list, if the value i not in the list returns -1
function getIndex(value, list) {
  for (var i in list) {
    if (list[i].name === value) {
     return i;
   }
 }
 return -1;
}

//calculate the daily total, return an list in format [{date:xxx, total:xxxx}, ...]
function calcDailyAmount(input){
  var list = input;
  var newList = [];
  var oldDate = list[0].Date;
  var currentDate;
  var dailytTotalAmount = parseFloat(list[0].Amount);
  for(var i = 1; i<list.length; i++){
    currentDate = list[i].Date;
    var todayAmount = parseFloat(list[i].Amount);
    if(currentDate === oldDate){
      dailytTotalAmount += todayAmount;
    }else{
      var newObj = {date:oldDate, total:dailytTotalAmount};
      newList.push(newObj);
      dailytTotalAmount = parseFloat(list[i].Amount);
    }
    oldDate = currentDate;
  }
  return newList;
} 


