'use strict';


angular.module('talents').controller('TalentProfileController', ['$scope', '$http', '$state', 'orderByFilter', 'TalentProfiles', 'Authentication', 
	function($scope, $http, $state, orderBy, TalentProfiles, Authentication) {

		$scope.authentication = Authentication;

		$scope.talentId = $state.params.talentId;

		


	$scope.thumbClick = function(e) {
			var clickedIndex = $(e.currentTarget).attr("data-slide-to");
			var activeSlide = angular.element('#carousel .active');

			activeSlide.removeClass('active');

			var carousel = angular.element('#carousel-slide-' + clickedIndex);

			carousel.addClass('active');

		}
	

	$scope.getProfile = function(id) {
			TalentProfiles.get({
				profileId: id
			}, function(data){
				$scope.talentProfile = data;
				$scope.getMedia();
			});
		}

	$scope.getMedia = function() {
			$scope.talentProfile.mediaArray = {};
			var tempArray = angular.fromJson($scope.talentProfile.mediaConfig);

			$scope.talentProfile.mediaArray.images = orderBy(tempArray.images, 'position');
			$scope.talentProfile.mediaArray.thumbs = [];

			for (var k=0, i = 0; k < $scope.talentProfile.mediaArray.images.length; k++) {
				if ( ((k / 4) % 1 == 0) || k == 0 ) {
					var currentSlide = i;
					$scope.talentProfile.mediaArray.thumbs[currentSlide] =[];
					$scope.talentProfile.mediaArray.thumbs[currentSlide].push($scope.talentProfile.mediaArray.images[k]);				
					i++;

				} else {
					$scope.talentProfile.mediaArray.thumbs[currentSlide].push($scope.talentProfile.mediaArray.images[k]);
				}
			}
		}


}]);