'use strict';

(function() {
  // Gigs Controller Spec
  describe('Gigs Controller Tests', function() {
    // Initialize global variables
    var GigsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Gigs,
      mockGig;

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
    beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Gigs_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Gigs = _Gigs_;

      // create mock gig
      mockGig = new Gigs({
        id: '525a8422f6d0f87f0e407a33',
        title: 'An Gig about SEANJS',
        content: 'SEANJS rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Gigs controller.
      GigsController = $controller('GigsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one gig object fetched from XHR', inject(function(Gigs) {
      // Create a sample gigs array that includes the new gig
      var sampleGigs = [mockGig];

      // Set GET response
      $httpBackend.expectGET('api/gigs').respond(sampleGigs);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.gigs).toEqualData(sampleGigs);
    }));

    it('$scope.findOne() should create an array with one gig object fetched from XHR using a gigId URL parameter', inject(function(Gigs) {
      // Set the URL parameter
      $stateParams.gigId = mockGig.id;

      // Set GET response
      $httpBackend.expectGET(/api\/gigs\/([0-9a-fA-F]{24})$/).respond(mockGig);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.gig).toEqualData(mockGig);
    }));

    describe('$scope.create()', function() {
      var sampleGigPostData;

      beforeEach(function() {
        // Create a sample gig object
        sampleGigPostData = new Gigs({
          title: 'An Gig about SEANJS',
          content: 'SEANJS rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Gig about SEANJS';
        scope.content = 'SEANJS rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function(Gigs) {
        // Set POST response
        $httpBackend.expectPOST('api/gigs', sampleGigPostData).respond(mockGig);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the gig was created
        expect($location.path.calls.mostRecent().args[0]).toBe('gigs/' + mockGig.id);
      }));

      it('should set scope.error if save error', function() {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/gigs', sampleGigPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function() {
      beforeEach(function() {
        // Mock gig in scope
        scope.gig = mockGig;
      });

      it('should update a valid gig', inject(function(Gigs) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/gigs\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/gigs/' + mockGig.id);
      }));

      it('should set scope.error to error response message', inject(function(Gigs) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/gigs\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(gig)', function() {
      beforeEach(function() {
        // Create new gigs array and include the gig
        scope.gigs = [mockGig, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/gigs\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockGig);
      });

      it('should send a DELETE request with a valid gigId and remove the gig from the scope', inject(function(Gigs) {
        expect(scope.gigs.length).toBe(2); //Because of the empty object - must be 1
      }));
    });

    describe('scope.remove()', function() {
      beforeEach(function() {
        spyOn($location, 'path');
        scope.gig = mockGig;

        $httpBackend.expectDELETE(/api\/gigs\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to gigs', function() {
        expect($location.path).toHaveBeenCalledWith('gigs');
      });
    });
  });
}());