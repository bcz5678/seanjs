'use strict';

/**
 * Edits by Ryan Hutchison
 * Credit: https://github.com/paulyoder/angular-bootstrap-show-errors */

angular.module('core').directive('videojs', [function(){
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			attrs.type = attrs.type || 'video/mp4';
			attrs.id = attrs.id || 'videojs' + Math.floor(Math.random() + 100);
			attrs.setup = attrs.setup || {};
			var setup = {
				'techOrder' : ['html5', 'flash'],
				'controls' : false,
				'preload' : false,
				'autoplay' : false,
				'width' : 'auto',
				'loop' : true,
			}; 

			setup = angular.extend(setup, attrs.setup); 

			element.attr('id', attrs.id);

			var player = _V_(attrs.id, setup, function(){
				this.src({ type: attrs.type, src: attrs.src}); 
			});

			element.bind('mouseenter', function(){
				player.play();
			});

			element.bind('mouseleave', function(){
				player.pause();
				player.posterImage.show();
			});
		}
	};
}]);