'use strict';

// Gigs controller
angular.module('gigs').controller('GigsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Gigs',
  function($scope, $stateParams, $location, Authentication, Gigs) {
    $scope.authentication = Authentication;

    // Create new Gig
    $scope.create = function(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'gigForm');

        return false;
      }

      // Create new Gig object
      var gig = new Gigs({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      gig.$save(function(response) {
        $location.path('gigs/' + response.id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Gig
    $scope.remove = function(gig) {
      if (gig) {

        gig.$remove();
        $location.path('gigs');
      } else {
        $scope.gig.$remove(function() {
          $location.path('gigs');
        });
      }
    };

    // Update existing Gig
    $scope.update = function(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'gigForm');
        return false;
      }

      var gig = $scope.gig;

      gig.$update(function() {
        $location.path('gigs/' + gig.id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Gigs
    $scope.find = function(userId) {
      $scope.gigs = Gigs.query();
    };

    // Find existing Gig
    $scope.findOne = function() {
      $scope.gig = Gigs.get({
        gigId: $stateParams.gigId
      });
    };
  }
])
.factory('filterHelper', function(){
  return {
    data: {}
  }
})
.controller('wizardController', ['$scope', 
  function($scope){
    $scope.formData = {};
  }
])
.controller('talentGalleryController', ['$scope', 'filterHelper', function($scope, filterHelper) {
  $scope.filterText = filterHelper.data;
  $scope.talentArray = [{ "name" :"Josephine Baker", 
            "topimage":"15-0001.jpg", 
            "age" : "25",
            "sex" : "Female",
            "ethnicity" : "Black",
            "languages" : "English, Russian, Mandarin",
            "personality_tags" : ["Model", "Actor", "Dancer"],
            },
            { "name" :"Bob Hope", 
            "topimage":"27-0001.jpg", 
            "age" : "65",
            "sex" : "Male",
            "ethnicity" : "White",
            "languages" : "English, German",
            "personality_tags" : ["Comedian", "Actor" ],
            },
            { "name" :"Tom Cruise", 
            "topimage":"19-0001.jpg", 
            "age" : "55",
            "sex" : "Male",
            "ethnicity" : "White",
            "languages" : "English, Cthulu, Scientology",
            "personality_tags" : ["Actor", "Nutjob"],
            },
            { "name" :"Jennifer Anniston", 
            "topimage":"193-0001.jpg", 
            "age" : "45",
            "sex" : "Female",
            "ethnicity" : "White",
            "languages" : "English, Sex",
            "personality_tags" : ["Actor", "Barista"],
            }]
}])
.controller('filterController', ['$scope', 'filterHelper', function($scope, filterHelper) {
  $scope.filter = filterHelper.data;

  $scope.filter.age = {
        from: 25, 
        to: 60,
        min: 18,
        max: 99,
        type: 'double',
        prettify: true,
        grid: true,
        force_edges: true,
        onChange: function(data) {
          $scope.filter.age.from = data.from;
          $scope.filter.age.to = data.to;        
        }
    };

    $scope.filter.height = {
        min: 0,
        max: 50,
        values: ["4'0","4'1","4'2","4'3","4'4","4'5","4'6","4'7","4'8","4'9","4'10","4'11",
                "5'0","5'1","5'2","5'3","5'4","5'5","5'6","5'7","5'8","5'9","5'10","5'11",
                "6'0","6'1","6'2","6'3","6'4","6'5","6'6","6'7","6'8","6'9","6'10","6'11"],
        from: 12,
        to: 24,
        type: 'double',
        prettify: false,
        grid: true,
        onChange: function(data) {
          $scope.filter.height.from = data.fromNumber;
          $scope.filter.height.to = data.toNumber;        
        }
    };

  $scope.filter.weight = {
        min: 0,
        max: 300,
        from: 100,
        to: 225,
        type: 'double',
        prettify: true,
        grid: true,
        onChange: function(data) {
          $scope.filter.weight.from = data.fromNumber;
          $scope.filter.weight.to = data.toNumber;        
        }
    };



  // ------------Start Ethnicity Checkbox Selection -------------
  $scope.filter.ethnicities = [
          {name : 'Caucasian', selected : false }, 
          {name : 'Black',  selected : false },
          {name : 'Asian',  selected : false },
          {name : 'Hispanic',  selected : false },
          {name : 'Native American',  selected : false },
          {name : 'Middle Eastern',  selected : false },
          ];


  $scope.filter.ethnicitiesSelection = [];

  //helper function
  $scope.selectedEthnicities = function() {
    return filterFilter($scope.filter.ethnicities, {selected: true});
  };

  //watch selected 

  $scope.$watch('filter.ethnicities|filter:{selected:true}', function(nv){
      $scope.filter.ethnicitiesSelection = nv.map(function(ethnicity){return ethnicity.name});
    }, true
  );


  // ------------Start Sex Checkbox Selection -------------
  $scope.filter.sexes = [
          {name : 'Male', selected : false }, 
          {name : 'Female',  selected : false },
          ];

  $scope.filter.sexesSelection = [];

  //helper function
  $scope.selectedSexes = function() {
    return filterFilter($scope.filter.sexes, {selected: true});
  };

  //watch selected 

  $scope.$watch('filter.sexes|filter:{selected:true}', function(nv){
      $scope.filter.sexesSelection = nv.map(function(sex){return sex.name});
    }, true
  );

  
  // ------------Start Language Checkbox Selection -------------
  $scope.filter.languages = [
            {name : 'English', selected : false }, 
            {name : 'German',  selected : false },
            {name : 'Spanish',  selected : false },
            {name : 'French', selected : false },
            {name : 'Russian',  selected : false },
            {name : 'Mandarin', selected : false },
            {name : 'Dutch',  selected : false }
            ];

  $scope.filter.languagesSelection = [];

  //helper function
  $scope.selectedLanguages = function() {
    return filterFilter($scope.filter.languages, {selected: true});
  };

  //watch selected 

  $scope.$watch('filter.languages|filter:{selected:true}', function(nv){
      $scope.filter.languagesSelection = nv.map(function(language){return language.name});
    }, true
  );


  // ------------Start Search Build  -------------
  $scope.buildFiltersSearch = function() {
      $scope.search = {}
      $scope.search.age = $scope.filter.age;
      $scope.search.weight = $scope.filter.weight;

      $scope.search.height = {};

      $scope.search.height.from = heightValues[$scope.filter.height.from];
      $scope.search.height.to = heightValues[$scope.filter.height.to];

      $scope.search.sexes = $scope.filter.sexesSelection;
      $scope.search.ethnicities = $scope.filter.ethnicitiesSelection;
      $scope.search.languages = $scope.filter.languagesSelection;

      console.log($scope.search);

     }

}]);