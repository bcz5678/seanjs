'use strict';

// Resources controller
angular.module('resources').controller('ResourcesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Resources',
  function($scope, $stateParams, $location, Authentication, Resources) {
    $scope.authentication = Authentication;

    // Create new Resource
    $scope.create = function(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resourceForm');

        return false;
      }

      // Create new Resource object
      var resource = new Resources({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      resource.$save(function(response) {
        $location.path('resources/' + response.id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Resource
    $scope.remove = function(resource) {
      if (resource) {

        resource.$remove();
        $location.path('resources');
      } else {
        $scope.resource.$remove(function() {
          $location.path('resources');
        });
      }
    };

    // Update existing Resource
    $scope.update = function(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resourceForm');
        return false;
      }

      var resource = $scope.resource;

      resource.$update(function() {
        $location.path('resources/' + resource.id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Resources
    $scope.find = function() {
      $scope.resources = Resources.query();
    };

    // Find existing Resource
    $scope.findOne = function() {
      $scope.resource = Resources.get({
        resourceId: $stateParams.resourceId
      });

    };
  }
]);

angular.module('resources').controller('TalentProfilesController', ['$scope', '$stateParams', '$location', 'Authentication', 'TalentProfiles',
  function($scope, $stateParams, $location, Authentication, TalentProfiles) {
    $scope.authentication = Authentication;

    // Create new tlentProfile
    $scope.create = function(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'talentProfileForm');

        return false;
      }

      // Create new talentProfile object
      var talentProfile = new TalentProfiles({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      resource.$save(function(response) {
        $location.path('talentprofiles/' + response.id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Resource
    $scope.remove = function(resource) {
      if (resource) {

        resource.$remove();
        $location.path('resources');
      } else {
        $scope.resource.$remove(function() {
          $location.path('resources');
        });
      }
    };

    // Update existing Resource
    $scope.update = function(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resourceForm');
        return false;
      }

      var resource = $scope.resource;

      resource.$update(function() {
        $location.path('resources/' + resource.id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Resources
    $scope.find = function() {
      $scope.resources = Resources.query();
    };

    // Find existing Resource
    $scope.findOne = function() {
      $scope.resource = Resources.get({
        resourceId: $stateParams.resourceId
      });

    };
  }
]);