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
.controller('wizardController', ['$scope', function($scope){
    //Initializing formData to gather form Information
    $scope.formData = {};
    $scope.formData.campaign = {};
    $scope.formData.campaign.brand = '';
    $scope.formData.page = 1;
    $scope.formData.video = {};

    // handler for radio boxes
    $scope.$watch('formData.videosetting', function(value){
      $scope.formData.video.setting = value;
      $scope.formData.video.settingOptions = 'Select';
    });

    //clears options ifVideo number is changed later.
    $scope.clearOptions = function() {
      if($scope.formData.campaign.videos.options) {
        $scope.formData.campaign.videos.options = {};
      }
    };

    // clears options if Video package type is changed later.
    $scope.clearPackageOptions = function() {
      if($scope.formData.campaign.videos.options.number || $scope.formData.campaign.videos.options.timeFrame) {
        delete $scope.formData.campaign.videos.options.number;
        delete $scope.formData.campaign.videos.options.timeFrame;
      }
    };

    $scope.videoTags = [{name : 'Modern', selected : false }, 
                        {name : 'Bright', selected : false }, 
                        {name : 'Funny', selected : false }, 
                        {name : 'Corporate', selected : false }, 
                        {name : 'Theatrical', selected : false }, 
                        {name : 'Inner monologue', selected : false }, 
                        {name : 'Vintage', selected : false }
                      ];
    $scope.selectedVideoTag = [];
  }
])
.controller('talentGalleryController', ['$scope', 'filterHelper', function($scope, filterHelper) {
  $scope.filterText = filterHelper.data;
  $scope.talentMediaUrl = "/uploads/users/media/";
  $scope.getVideoUrl = function(talentId, videoId) {
    return $scope.talentMediaUrl + talentId + '/' + videoId;
  };

   $scope.getImageUrl = function(talentId, imageId) {
    return $scope.talentMediaUrl + talentId + '/' + imageId;
  };


  $scope.talentArray = [{ "id" : 15,
            "name" :"Josephine Baker", 
            "topimage":"15-0001.jpg", 
            "profileVideoName" : "15-profile.mp4",
            "age" : "25",
            "sex" : "Female",
            "rating" : "5",
            "ethnicity" : "Black",
            "languages" : "English, Russian, Mandarin",
            "personality_tags" : ["Model", "Actor", "Dancer"],
            },
            { "id" : 27,
            "name" :"Bob Hope", 
            "topimage":"27-0001.jpg",
            "profileVideoName" : "test.mp4", 
            "age" : "65",
            "sex" : "Male",
            "rating" : "3.9",
            "ethnicity" : "White",
            "languages" : "English, German",
            "personality_tags" : ["Comedian", "Actor" ],
            },
            { "id" : 19,
            "name" :"Tom Cruise", 
            "topimage":"19-0001.jpg", 
            "profileVideoName" : "test2.mp4",
            "age" : "55",
            "sex" : "Male",
            "rating" : "4.1",
            "ethnicity" : "White",
            "languages" : "English, Cthulu, Scientology",
            "personality_tags" : ["Actor", "Nutjob"],
            },
            { "id" : 193,
            "name" :"Jennifer Anniston", 
            "topimage":"193-0001.jpg", 
            "profileVideoName" : "193-profile.mp4",
            "age" : "45",
            "sex" : "Female",
            "rating" : "4.5",
            "ethnicity" : "White",
            "languages" : "English, Sex",
            "personality_tags" : ["Actor", "Barista"],
            }]
}])
.controller('filterController', ['$scope', 'filterHelper', function($scope, filterHelper) {
  $scope.filter = filterHelper.data;

  $scope.filter.ages =  [ "18-24",
                          "25-29",
                          "30-35",
                          "36-40",
                          "40-50",
                          "50-60",
                          "60+"
                        ];

  $scope.filter.physicalTypes = [  "Tall",
                                  "Short",
                                  "Slim",
                                  "Curvy",
                                  "Fit/Athletic",
                                  "Muscular",
                                  "Plus-size"
                                ];

  $scope.filter.hairColors  = [ "Blonde", 
                                "Brunette", 
                                "Red", 
                                "Gray",
                                'Salt and Pepper', 
                                'None'
                              ];


  // ------------Start Ethnicity Checkbox Selection -------------
  $scope.filter.ethnicities = [
          {name : 'Caucasian', selected : false }, 
          {name : 'Black',  selected : false },
          {name : 'Asian',  selected : false },
          {name : 'Native American',  selected : false },
          {name : 'Middle Eastern',  selected : false },
          {name : 'Hispanic',  selected : false },
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
            {name : 'Portugueuse',  selected : false }
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

   // ------------Start Age Checkbox Selection -------------


  $scope.filter.ages =  [ 
              {name : "18-24", selected : false },
              {name : "25-29", selected : false },
              {name : "30-35", selected : false },
              {name : "36-40", selected : false },
              {name : "40-50", selected : false },
              {name : "50-60", selected : false },
              {name : "60+", selected : false }
            ];

  $scope.filter.agesSelection = [];

  //helper function
  $scope.selectedAges = function() {
    return filterFilter($scope.filter.ages, {selected: true});
  };

  //watch selected 

  $scope.$watch('filter.ages|filter:{selected:true}', function(nv){
      $scope.filter.agesSelection = nv.map(function(age){return age.name});
    }, true
  );


   // ------------Start Ethnicity Checkbox Selection -------------
  $scope.filter.modelTags = [
          {name : 'Model', selected : false }, 
          {name : 'Singer',  selected : false },
          {name : 'Dancer',  selected : false },
          {name : 'Energetic',  selected : false },
          {name : 'Comedic',  selected : false },
          {name : 'Dramatic',  selected : false },
          ];


  $scope.filter.modelTagsSelection = [];

  //helper function
  $scope.selectedModelTags = function() {
    return filterFilter($scope.filter.modelTags, {selected: true});
  };

  //watch selected 

  $scope.$watch('filter.modelTags|filter:{selected:true}', function(nv){
      $scope.filter.modelTagsSelection = nv.map(function(modelTag){return modelTag.name});
    }, true
  );


  $scope.currentSearch = {};
  $scope.currentTalentArray = {};

  // ------------Start Search Build  -------------
  $scope.buildSearch = function() {
      $scope.search = {}
      $scope.search.ages = $scope.filter.ages;
      $scope.search.sexes = $scope.filter.sexesSelection;
      $scope.search.ethnicities = $scope.filter.ethnicitiesSelection;
      $scope.search.languages = $scope.filter.languagesSelection;

      console.log($scope.search);
     };
  }
]);