'use strict';


angular.module('talents').controller('TalentProfileController', ['$scope', '$http', 'TalentProfiles', 'Authentication', 
	function($scope, $http, TalentProfiles, Authentication) {

		$scope.authentication = Authentication;




	$scope.thumbClick = function(e) {
			var clickedIndex = $(e.currentTarget).attr("data-slide-to");

			var activeSlide = angular.element('#carousel .active');


			activeSlide.removeClass('active');


			var carousel = angular.element('#carousel-slide-' + clickedIndex);

			carousel.addClass('active');

			console.log(carousel);

		}

	$scope.getProfile = function() {
			$scope.talentProfile = TalentProfiles.get({
			});
		}

}]);