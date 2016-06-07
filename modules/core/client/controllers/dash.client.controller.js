'use strict';

angular.module('core').controller('DashController', ['$rootScope', '$scope', '$location', '$state', '$http','Authentication',
  function($rootScope, $scope, $location, $state, $http, Authentication) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;


    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function() {
      $scope.isCollapsed = false;
      ga('send', 'pageview', $location.path());
    });
  }
]);