'use strict';

// Messages controller
angular.module('messages').controller('MessagesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Messages',
  function($scope, $stateParams, $location, Authentication, Messages) {
    $scope.authentication = Authentication;

    // Create new Message
    $scope.create = function(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'messageForm');

        return false;
      }

      // Create new Message object
      var message = new Messages({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      message.$save(function(response) {
        $location.path('messages/' + response.id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Message
    $scope.remove = function(message) {
      if (message) {

        message.$remove();
        $location.path('messages');
      } else {
        $scope.message.$remove(function() {
          $location.path('messages');
        });
      }
    };

    // Update existing Message
    $scope.update = function(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'messageForm');
        return false;
      }

      var message = $scope.message;

      message.$update(function() {
        $location.path('messages/' + message.id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Messages
    $scope.find = function() {
      $scope.messages = Messages.query();
    };

    // Find existing Message
    $scope.findOne = function() {
      $scope.message = Messages.get({
        messageId: $stateParams.messageId
      });

    };
  }
]);

angular.module('messages').controller('TalentProfilesController', ['$scope', '$stateParams', '$location', 'Authentication', 'TalentProfiles',
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
      message.$save(function(response) {
        $location.path('talentprofiles/' + response.id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Message
    $scope.remove = function(message) {
      if (message) {

        message.$remove();
        $location.path('messages');
      } else {
        $scope.message.$remove(function() {
          $location.path('messages');
        });
      }
    };

    // Update existing Message
    $scope.update = function(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'messageForm');
        return false;
      }

      var message = $scope.message;

      message.$update(function() {
        $location.path('messages/' + message.id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Messages
    $scope.find = function() {
      $scope.messages = Messages.query();
    };

    // Find existing Message
    $scope.findOne = function() {
      $scope.message = Messages.get({
        messageId: $stateParams.messageId
      });

    };
  }
]);