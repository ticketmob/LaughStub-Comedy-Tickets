		function getVenues() {
			$.mobile.changePage("#venuesPage", "slideup", false, false);	
		}
		
		function gethome() {
			$.mobile.changePage("#mainpage", "slideup", false, false);	
		}

		$(document).ready( function () {
			run();
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
			alert('Connection type: ' + states[networkState]);
		}
		
		// PhoneGap is loaded and it is now safe to make calls PhoneGap methods
		function onDeviceReady() {
			navigator.network.isReachable('phonegap.com', reachableCallback);
		}
