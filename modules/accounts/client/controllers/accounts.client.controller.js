'use strict';

// Accounts controller
angular.module('accounts').controller('AccountsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Accounts',
  function($scope, $stateParams, $location, Authentication, Accounts) {
    $scope.authentication = Authentication;

    $scope.page = 1;

    // Create new Account
    $scope.create = function(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'accountForm');

        return false;
      }

      // Create new Account object
      var account = new Accounts({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      account.$save(function(response) {
        $location.path('accounts/' + response.id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Account
    $scope.remove = function(account) {
      if (account) {

        account.$remove();
        $location.path('accounts');
      } else {
        $scope.account.$remove(function() {
          $location.path('accounts');
        });
      }
    };

    // Update existing Account
    $scope.update = function(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'accountForm');
        return false;
      }

      var account = $scope.account;

      account.$update(function() {
        $location.path('accounts/' + account.id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Accounts
    $scope.find = function() {
      $scope.accounts = Accounts.query();
    };

    // Find existing Account
    $scope.findOne = function() {
      $scope.account = Accounts.get({
        accountId: $stateParams.accountId
      });

    };
  }
]);

angular.module('accounts').controller('TalentProfilesController', ['$scope', '$stateParams', '$location', 'Authentication', 'TalentProfiles',
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
      account.$save(function(response) {
        $location.path('talentprofiles/' + response.id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Account
    $scope.remove = function(account) {
      if (account) {

        account.$remove();
        $location.path('accounts');
      } else {
        $scope.account.$remove(function() {
          $location.path('accounts');
        });
      }
    };

    // Update existing Account
    $scope.update = function(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'accountForm');
        return false;
      }

      var account = $scope.account;

      account.$update(function() {
        $location.path('accounts/' + account.id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Accounts
    $scope.find = function() {
      $scope.accounts = Accounts.query();
    };

    // Find existing Account
    $scope.findOne = function() {
      $scope.account = Accounts.get({
        accountId: $stateParams.accountId
      });

    };
  }
]);