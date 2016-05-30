'use strict';

angular.module('core').controller('SidebarController', ['$rootScope', '$scope', '$location', '$state', '$http','Authentication', 'Menus', 'sidebarClass',
  function($rootScope, $scope, $location, $state, $http, Authentication, Menus, sidebarClass) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;
    
    $scope.sidebarClass = sidebarClass;


    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function() {
      $scope.isCollapsed = false;
      ga('send', 'pageview', $location.path());
    });

    

  }
]);