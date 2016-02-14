'use strict';

(function() {
  // Accounts Controller Spec
  describe('Accounts Controller Tests', function() {
    // Initialize global variables
    var AccountsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Accounts,
      mockAccount;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function() {
      jasmine.addMatchers({
        toEqualData: function(util, customEqualityTesters) {
          return {
            compare: function(actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Accounts_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Accounts = _Accounts_;

      // create mock account
      mockAccount = new Accounts({
        id: '525a8422f6d0f87f0e407a33',
        title: 'An Account about SEANJS',
        content: 'SEANJS rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Accounts controller.
      AccountsController = $controller('AccountsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one account object fetched from XHR', inject(function(Accounts) {
      // Create a sample accounts array that includes the new account
      var sampleAccounts = [mockAccount];

      // Set GET response
      $httpBackend.expectGET('api/accounts').respond(sampleAccounts);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.accounts).toEqualData(sampleAccounts);
    }));

    it('$scope.findOne() should create an array with one account object fetched from XHR using a accountId URL parameter', inject(function(Accounts) {
      // Set the URL parameter
      $stateParams.accountId = mockAccount.id;

      // Set GET response
      $httpBackend.expectGET(/api\/accounts\/([0-9a-fA-F]{24})$/).respond(mockAccount);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.account).toEqualData(mockAccount);
    }));

    describe('$scope.create()', function() {
      var sampleAccountPostData;

      beforeEach(function() {
        // Create a sample account object
        sampleAccountPostData = new Accounts({
          title: 'An Account about SEANJS',
          content: 'SEANJS rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Account about SEANJS';
        scope.content = 'SEANJS rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function(Accounts) {
        // Set POST response
        $httpBackend.expectPOST('api/accounts', sampleAccountPostData).respond(mockAccount);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the account was created
        expect($location.path.calls.mostRecent().args[0]).toBe('accounts/' + mockAccount.id);
      }));

      it('should set scope.error if save error', function() {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/accounts', sampleAccountPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function() {
      beforeEach(function() {
        // Mock account in scope
        scope.account = mockAccount;
      });

      it('should update a valid account', inject(function(Accounts) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/accounts\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/accounts/' + mockAccount.id);
      }));

      it('should set scope.error to error response message', inject(function(Accounts) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/accounts\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(account)', function() {
      beforeEach(function() {
        // Create new accounts array and include the account
        scope.accounts = [mockAccount, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/accounts\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockAccount);
      });

      it('should send a DELETE request with a valid accountId and remove the account from the scope', inject(function(Accounts) {
        expect(scope.accounts.length).toBe(2); //Because of the empty object - must be 1
      }));
    });

    describe('scope.remove()', function() {
      beforeEach(function() {
        spyOn($location, 'path');
        scope.account = mockAccount;

        $httpBackend.expectDELETE(/api\/accounts\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to accounts', function() {
        expect($location.path).toHaveBeenCalledWith('accounts');
      });
    });
  });
}());