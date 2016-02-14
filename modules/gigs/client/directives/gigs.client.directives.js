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
});