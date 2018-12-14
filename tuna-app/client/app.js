// SPDX-License-Identifier: Apache-2.0

'use strict';

var app = angular.module('application', []);

// Angular Controller
app.controller('appController', function($scope, appFactory){

	$("#success_holder").hide();
	$("#success_create").hide();
	$("#error_holder").hide();
	$("#error_query").hide();
	
	$scope.queryAllTuna = function(){
		console.log('####queryAllTuna###');

		appFactory.queryAllTuna(function(data){
			var array = [];
			for (var i = 0; i < data.length; i++){
				parseInt(data[i].Key);
				data[i].Record.Key = parseInt(data[i].Key);
				array.push(data[i].Record);
			}
			array.sort(function(a, b) {
			    return parseFloat(a.Key) - parseFloat(b.Key);
			});
			$scope.all_tuna = array;
		});
	}

	$scope.getHistory = function(){

		var id = $scope.tuna_id;
		console.log('getHistory');
		appFactory.getHistory(id, function(data){
			console.log('getHistory' + data);
			if (data == "Could not locate tuna"){
				console.log()
				$("#error_query").show();
				$scope.query_history = null
			} else{
				$("#error_query").hide();
				var array = [];
				for (var i = 0; i < data.length; i++){
					data[i].Record.TxId = data[i].TxId;
					array.push(data[i].Record);
				}
				$scope.query_history = array;
			}
			
			console.log('raw value scope.get_history' + $scope.query_history);

			

		});
	}

	$scope.queryTuna = function(){
		var id = $scope.tuna_id;

		appFactory.queryTuna(id, function(data){
			$scope.query_tuna = data;
			console.log('%%%%%%queryTuna');

			if ($scope.query_tuna == "Could not locate tuna"){
				console.log()
				$("#error_query").show();
			} else{
				$("#error_query").hide();
			}
		});
	}

	$scope.recordTuna = function(){

		appFactory.recordTuna($scope.tuna, function(data){
			$scope.create_tuna = data;
			$("#success_create").show();
		});
	}

	$scope.changeHolder = function(){

		appFactory.changeHolder($scope.holder, function(data){
			$scope.change_holder = data;
			if ($scope.change_holder == "Error: no tuna catch found"){
				$("#error_holder").show();
				$("#success_holder").hide();
			} else{
				$("#success_holder").show();
				$("#error_holder").hide();
			}
		});
	}

});

// Angular Factory
app.factory('appFactory', function($http){
	
	var factory = {};

    factory.queryAllTuna = function(callback){
		console.log("####queryAllTuna###");

    	$http.get('/get_all_tuna/').success(function(output){
			callback(output)
		});
	}

	factory.queryTuna = function(id, callback){
    	$http.get('/get_tuna/'+id).success(function(output){
			callback(output)
		});
	}

	factory.getHistory = function(id, callback){
    	$http.get('/get_history/'+id).success(function(output){
			callback(output)
		});
	}

	factory.recordTuna = function(data, callback){

		// data.location = data.longitude + ", "+ data.latitude;

		var tuna = data.id + "-" + data.patientid + "-" + data.patientname + "-" + data.insuranceid + "-" + data.claimid+ "-" + data.timestamp;

    	$http.get('/add_tuna/'+tuna).success(function(output){
			callback(output)
		});
	}

	factory.changeHolder = function(data, callback){

		var holder = data.id + "-" + data.name;

    	$http.get('/change_holder/'+holder).success(function(output){
			callback(output)
		});
	}

	return factory;
});


