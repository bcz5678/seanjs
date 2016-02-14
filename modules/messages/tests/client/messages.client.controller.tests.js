'use strict';

(function() {
  // Messages Controller Spec
  describe('Messages Controller Tests', function() {
    // Initialize global variables
    var MessagesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Messages,
      mockMessage;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // message and ignores methods.
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
    beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Messages_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Messages = _Messages_;

      // create mock message
      mockMessage = new Messages({
        id: '525a8422f6d0f87f0e407a33',
        title: 'An Message about SEANJS',
        content: 'SEANJS rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Messages controller.
      MessagesController = $controller('MessagesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one message object fetched from XHR', inject(function(Messages) {
      // Create a sample messages array that includes the new message
      var sampleMessages = [mockMessage];

      // Set GET response
      $httpBackend.expectGET('api/messages').respond(sampleMessages);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.messages).toEqualData(sampleMessages);
    }));

    it('$scope.findOne() should create an array with one message object fetched from XHR using a messageId URL parameter', inject(function(Messages) {
      // Set the URL parameter
      $stateParams.messageId = mockMessage.id;

      // Set GET response
      $httpBackend.expectGET(/api\/messages\/([0-9a-fA-F]{24})$/).respond(mockMessage);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.message).toEqualData(mockMessage);
    }));

    describe('$scope.create()', function() {
      var sampleMessagePostData;

      beforeEach(function() {
        // Create a sample message object
        sampleMessagePostData = new Messages({
          title: 'An Message about SEANJS',
          content: 'SEANJS rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Message about SEANJS';
        scope.content = 'SEANJS rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function(Messages) {
        // Set POST response
        $httpBackend.expectPOST('api/messages', sampleMessagePostData).respond(mockMessage);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the message was created
        expect($location.path.calls.mostRecent().args[0]).toBe('messages/' + mockMessage.id);
      }));

      it('should set scope.error if save error', function() {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/messages', sampleMessagePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function() {
      beforeEach(function() {
        // Mock message in scope
        scope.message = mockMessage;
      });

      it('should update a valid message', inject(function(Messages) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/messages\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/messages/' + mockMessage.id);
      }));

      it('should set scope.error to error response message', inject(function(Messages) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/messages\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(message)', function() {
      beforeEach(function() {
        // Create new messages array and include the message
        scope.messages = [mockMessage, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/messages\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockMessage);
      });

      it('should send a DELETE request with a valid messageId and remove the message from the scope', inject(function(Messages) {
        expect(scope.messages.length).toBe(2); //Because of the empty object - must be 1
      }));
    });

    describe('scope.remove()', function() {
      beforeEach(function() {
        spyOn($location, 'path');
        scope.message = mockMessage;

        $httpBackend.expectDELETE(/api\/messages\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to messages', function() {
        expect($location.path).toHaveBeenCalledWith('messages');
      });
    });
  });
}());