'use strict';

(function() {
  // Resources Controller Spec
  describe('Resources Controller Tests', function() {
    // Initialize global variables
    var ResourcesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Resources,
      mockResource;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // resource and ignores methods.
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
    beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Resources_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Resources = _Resources_;

      // create mock resource
      mockResource = new Resources({
        id: '525a8422f6d0f87f0e407a33',
        title: 'An Resource about SEANJS',
        content: 'SEANJS rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Resources controller.
      ResourcesController = $controller('ResourcesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one resource object fetched from XHR', inject(function(Resources) {
      // Create a sample resources array that includes the new resource
      var sampleResources = [mockResource];

      // Set GET response
      $httpBackend.expectGET('api/resources').respond(sampleResources);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.resources).toEqualData(sampleResources);
    }));

    it('$scope.findOne() should create an array with one resource object fetched from XHR using a resourceId URL parameter', inject(function(Resources) {
      // Set the URL parameter
      $stateParams.resourceId = mockResource.id;

      // Set GET response
      $httpBackend.expectGET(/api\/resources\/([0-9a-fA-F]{24})$/).respond(mockResource);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.resource).toEqualData(mockResource);
    }));

    describe('$scope.create()', function() {
      var sampleResourcePostData;

      beforeEach(function() {
        // Create a sample resource object
        sampleResourcePostData = new Resources({
          title: 'An Resource about SEANJS',
          content: 'SEANJS rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Resource about SEANJS';
        scope.content = 'SEANJS rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function(Resources) {
        // Set POST response
        $httpBackend.expectPOST('api/resources', sampleResourcePostData).respond(mockResource);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the resource was created
        expect($location.path.calls.mostRecent().args[0]).toBe('resources/' + mockResource.id);
      }));

      it('should set scope.error if save error', function() {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/resources', sampleResourcePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function() {
      beforeEach(function() {
        // Mock resource in scope
        scope.resource = mockResource;
      });

      it('should update a valid resource', inject(function(Resources) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/resources\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/resources/' + mockResource.id);
      }));

      it('should set scope.error to error response message', inject(function(Resources) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/resources\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(resource)', function() {
      beforeEach(function() {
        // Create new resources array and include the resource
        scope.resources = [mockResource, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/resources\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockResource);
      });

      it('should send a DELETE request with a valid resourceId and remove the resource from the scope', inject(function(Resources) {
        expect(scope.resources.length).toBe(2); //Because of the empty object - must be 1
      }));
    });

    describe('scope.remove()', function() {
      beforeEach(function() {
        spyOn($location, 'path');
        scope.resource = mockResource;

        $httpBackend.expectDELETE(/api\/resources\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to resources', function() {
        expect($location.path).toHaveBeenCalledWith('resources');
      });
    });
  });
}());