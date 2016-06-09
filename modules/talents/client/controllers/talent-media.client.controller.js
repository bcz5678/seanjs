'use strict';


angular.module('talents').controller('talentMediaController', ['$scope', '$http', 'Talents', 'TalentMedia', 'Authentication', 
	function($scope, $http, Talents, TalentMedia, Authentication) {

		$scope.authentication = Authentication;

		$scope.togglePhotoUpload = false;
		$scope.toggleMediaUpload = false;


	$scope.getMedia = function(id) {
		$scope.mediaArray = TalentMedia.get({
			mediaId: id
		});
	}


	$scope.thumbClick = function(e) {
			var clickedIndex = $(e.currentTarget).attr("data-slide-to");
			var activeSlide = angular.element('#carousel .active');

			activeSlide.removeClass('active');

			var carousel = angular.element('#carousel-slide-' + clickedIndex);

			carousel.addClass('active');
		}
}]);