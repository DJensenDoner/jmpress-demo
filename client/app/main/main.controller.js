'use strict';

angular.module('davidTestProjectApp')
  .controller('MainCtrl', function ($scope, $filter, WeatherService, LocationService) {
    $scope.date    = new Date();
    $scope.currentYear = new Date().getFullYear();
    $scope.selectedYear = '';
    $scope.monthDay = '';
    $scope.message = 'Enter your Zip code to start your search!!';
    $scope.errors  = '';
    $scope.format  = 'yyyyMMdd';
    $scope.zipCode = '';
    $scope.weatherResults = [];
    $scope.average = 0;
    $scope.counter = 0;
    $scope.totalTemp = 0;

    $scope.city   = '';
    $scope.state  = '';

    $scope.clear = function () {
        $scope.date = null;
      };

      // Disable weekend selection
      $scope.disabled = function(date, mode) {
        return false;
      };

      $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
      };
      $scope.toggleMin();

      $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
      };

      $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1
      };

    $scope.findLocation = function(){
    	LocationService.getLocation($scope.zipCode).then(function(myZipCode){
    		$scope.zipCode = myZipCode;
    		console.log($scope.zipCode);
    		$scope.message = 'Now select a date!!';
	    	$scope.city   = $scope.zipCode[0].city_states[0].city;
	    	$scope.state  = $scope.zipCode[0].city_states[0].state_abbreviation;
	    	console.log('your city is ' + $scope.city);
	    	console.log('your state is ' + $scope.state);
    	});
    }


    $scope.submit = function(){
      console.log('this is the starting counter ' + $scope.counter);
    	if($scope.city && $scope.state){
	    	if($scope.date){
          // 1. need to ask what date the user was born - done
	    		$scope.date = $filter('date')($scope.date, 'yyyyMMdd');
          // 1.c store selected date in two separate variables.
          // 1.c.1 month/day
          // 1.c.2 year (to be incremented)
          $scope.selectedYear = $scope.date.substring(0,4);
          $scope.monthDay = $scope.date.substring(4);
          // 2. loop while selected year < current year
          while($scope.selectedYear <= $scope.currentYear){
            // 2.b inside of each loop, make an api to wunderground.
            WeatherService.getWeather($scope.selectedYear, $scope.monthDay, $scope.city, $scope.state).then(function(weather){
              // 3. save all tempurature data to an array
              $scope.weatherResults.push(weather);
              $scope.totalTemp += parseInt(weather.history.observations[0].tempi);
              console.log(weather.history.observations[0].tempi, $scope.counter, $scope.totalTemp);
              $scope.average = $scope.totalTemp / $scope.counter;
            });
            // 2.a incremnt the selected year until it matches the current year
            $scope.selectedYear++;
            $scope.counter++;
          }
          // 4. once the array is filled with correct data, average out the temps.
          $scope.message = 'feel free to enter another date!';
          $scope.errors = '';
        } else {
          $scope.errors = 'please select a date';
        }
      }
    }




    // 5. display the temps on the page, with text like "the average temp on yur birthday was _____"


});
