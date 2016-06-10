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
			$scope.talentMediaArray = {};
			var tempArray = angular.fromJson($scope.talentProfile.mediaConfig);

			$scope.talentMediaArray.images = orderBy(tempArray.images, 'position');
			$scope.talentMediaArray.thumbs = [];

			for (var k=0, i = 0; k < $scope.talentMediaArray.images.length; k++) {
				if ( ((k / 4) % 1 == 0) || k == 0 ) {
					var currentSlide = i;
					$scope.talentMediaArray.thumbs[currentSlide] =[];
					$scope.talentMediaArray.thumbs[currentSlide].push($scope.talentMediaArray.images[k]);				
					i++;

				} else {
					$scope.talentMediaArray.thumbs[currentSlide].push($scope.talentMediaArray.images[k]);
				}
			}
		}

	$scope.getFolderMedia = function(id) {
		$http.get('/api/talent/images/'+id).success(function (files){
    		$scope.talentFolderMediaArray = files;             
		}); 
	}

}]);