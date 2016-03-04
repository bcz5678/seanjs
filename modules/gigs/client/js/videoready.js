$(document).ready(function(){
			$('.video-js').mouseenter(function(){
				var player = videojs(this);
				player.play();
			}).mouseleave(function(){
				var player = videojs(this);
				player.pause().currentTime(0).trigger('loadstart');
			});		
		});