		var online = navigator.onLine || false;
		var callbackFlag = false;

		function getVenues() {
			alert(online);
			alert(callbackFlag);
			$.mobile.changePage("#venuesPage", "slideup", false, false);	
		}
		
		function gethome() {
			$.mobile.changePage("#mainpage", "slideup", false, false);	
		}

		$(document).ready( function () {
			$.ajax({
				type: "GET",
				url: "http://www.ticketmob.com/PhoneGap/index.cfm",
				data: {
					mode: '0'
				},
				dataType: "jsonp",
				success: function(result){
					$('#showlist').html(result.html);
				}
			});
			
		});
		
		
		$( function () {
			document.addEventListener("deviceready", onDeviceReady, false);
		});
		
		function reachableCallback(reachability) {
			var networkState = reachability.code || reachability;
			var states = {};
			states[NetworkStatus.NOT_REACHABLE] = 'No network connection';
			states[NetworkStatus.REACHABLE_VIA_CARRIER_DATA_NETWORK] = 'Carrier data connection';
			states[NetworkStatus.REACHABLE_VIA_WIFI_NETWORK] = 'WiFi connection';
			
			if(networkState != 0) {
				online = true;
				callbackFlag = true;
			}

			navigator.geolocation.getCurrentPosition(function (position) {
				var coords = position.coords;
				var location = "" + position.coords.latitude + "," + position.coords.longitude;
				var url = "http://maps.google.com/maps/api/staticmap?center=" + coords.latitude + "," + coords.longitude + "&zoom=13&size=320x480&maptype=roadmap&key=MyGoogleMapsAPIKey&sensor=true";
	
				/*
				store.save( {
					key: 'configLoc',
					location: location,
					lat: position.coords.latitude,
					lon: position.coords.longitude
				});
				}, function () {
					alert('Can\'t use your current position');
				*/
			});

		}
		
		// PhoneGap is loaded and it is now safe to make calls PhoneGap methods
		function onDeviceReady() {
			alert('device ready');
			navigator.network.isReachable('google.com', reachableCallback, {});
		}

