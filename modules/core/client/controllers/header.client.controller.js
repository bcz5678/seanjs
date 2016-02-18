'use strict';

angular.module('core').controller('HeaderController', ['$rootScope', '$scope', '$location', '$state', '$http','Authentication', 'Menus',
  function($rootScope, $scope, $location, $state, $http, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    $http.get("api/messages/unread").success(function(message){
      $scope.unreadMessages = message;
    });
    

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function() {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function() {
      $scope.isCollapsed = false;
      ga('send', 'pageview', $location.path());
    });

  }
]);