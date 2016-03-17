'use strict';


angular.module('talents').controller('talentsController', ['$scope', '$http', 'talents', 'Authentication', 
	function($scope, $http, talents, Authentication) {

		$scope.authentication = Authentication;

		$http.get("api/talent/" + $scope.authentication.user.id).success(function(profile){
	      $scope.talentProfile = profile;
	    });

		$scope.togglePhotoUpload = false;
		$scope.toggleMediaUpload = false;

		$scope.editHeadline = false;
		$scope.editVitals = false;

		$scope.ageRange = _.range(18, 99);
		$scope.weightRange = _.range(80, 350);
		$scope.heightArray = [	"4'0", "4'1", "4'2", "4'3", "4'4", "4'5", "4'6", "4'7", "4'8", "4'9", "4'10", "4'11",
								"5'0", "5'1", "5'2", "5'3", "5'4", "5'5", "5'6", "5'7", "5'8", "5'9", "5'10", "5'11",
								"6'0", "6'1", "6'2", "6'3", "6'4", "6'5", "6'6", "6'7", "6'8", "6'9", "6'10", "6'11"
								];
		$scope.hairColorArray = ['Blonde', 'Brunette', 'Red', 'Gray', 'Salt and Pepper', 'None'];
		$scope.hairTypeArray = ['Straight', 'Curly', 'Wavy', 'Balding', 'Bald'];
		$scope.physicalTypeArray = [  "Tall",
                                  "Short",
                                  "Slim",
                                  "Curvy",
                                  "Fit/Athletic",
                                  "Muscular",
                                  "Plus-size"
                                ];
        $scope.languagesArray = [	'English', 
						            'German',
						            'Spanish',
						            'French',
						            'Russian',
						            'Mandarin',
						            'Portugueuse' 
						            ];
		$scope.ethnicityArray = [ 'Caucasian', 
						          'Black', 
						          'Asian', 
						          'Hispanic', 
						          'Native American', 
						          'Middle Eastern', 
						          ];
		$scope.characterTags = [  'Model', 
						          'Singer', 
						          'Dancer', 
						          'Energetic', 
						          'Comedic', 
						          'Dramatic'
						          ];


		$scope.thumbClick = function(e) {
			var clickedIndex = $(e.currentTarget).attr("data-slide-to");

			var activeSlide = angular.element('#carousel .active');


			activeSlide.removeClass('active');


			var carousel = angular.element('#carousel-slide-' + clickedIndex);

			carousel.addClass('active');

			console.log(carousel);

		}


}]);