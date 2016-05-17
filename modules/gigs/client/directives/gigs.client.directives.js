'use strict';

angular.module('gigs').directive('ionRangeSlider', function(){
    return {
        restrict: 'EA',
        scope: {
            rangeOptions: '='
        },
        link: function (scope, elem, attrs) {
            elem.ionRangeSlider(scope.rangeOptions);
        }
    }
})
.directive('starRate', function(){
    return {
        restrict: 'EA',
        scope: {
            rating: '='
        },
        template: 	'<ul class="rating">' +
        			'	<li ng-repeat="star in stars" >' +
        			'		<i class="fa" ng-class="star"></i>' +
        			'	</li>' +
        			'</ul> ({{ talent.rating }}) {{ stars }}'
        ,
        link: function (scope, elem, attrs) {
        	$scope.max = 5;
        	$scope.stars = [];
        	for (var i = 0; i < max; i++) {
        		if (i + 1 < Math.floor($scope.rating)) {
        				$scope.stars[i] = 'fa-star';
	        		} else if ($scope.rating - (i + 1) <= 0.3) {
	        			$scope.stars[i] = 'fa-star-o';
	        		} else if (($scope.rating - (i + 1)  >= 0.4) && ($scope.rating - (i + 1)  <= 0.7)) {
	        			$scope.stars[i] = 'fa-star-half';
	        		} else if ($scope.rating - (i + 1) >= 0.8) {
	        			$scope.stars[i] = 'fa-star';
	        		}
        		}
        	}
        }
    }
);
