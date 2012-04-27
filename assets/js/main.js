		var online = navigator.onLine || false;
		var coords = null;
		var positionFlag = false;

		function getvenues() {
			$.mobile.changePage("#venuesPage", "slideup", false, false);
		}
		
		function gethome() {
			$.mobile.changePage("#mainpage", "slideup", false, false);
			getFeatureFeed(1);
		}
		
		function getcomedian() {
			$.mobile.changePage("#comedianPage", "slideup", false, false);
			getFeatureFeed(2);
		}
		
		function getcalendar() {
			$.mobile.changePage("#calendarPage", "slideup", false, false);
			getFeatureFeed(3);
		}
		
		$(document).ready( function () {
			var style = 1;
			var getURL = "http://www.ticketmob.com/PhoneGap/index.cfm?mode=1"+"&style="+style;
			$.ajax({
				type: "GET",
				url: getURL,
				data: {
					mode: '0'
				},
				dataType: "jsonp",
				success: function(result){
					$('#showlist').html(result.html);
					$('#showlist').find("ul").listview();
				}
			});
		});

		function getFeatureFeed(style) {
			if(positionFlag && coords != null)
				var getURL = "http://www.ticketmob.com/PhoneGap/index.cfm?lat="+coords.latitude+"&lon="+coords.longitude+"&style="+style;
			else
				var getURL = "http://www.ticketmob.com/PhoneGap/index.cfm?lat=0&lon=0"+"&style="+style;

			$.ajax({
				type: "GET",
				url: getURL,
				data: {
					mode: '0'
				},
				dataType: "jsonp",
				success: function(result){
					$('#showlist').html(result.html);
					$('#showlist').find("ul").listview();
				}
			});
		}
			
		
		function openDialog(id) {
			var dialog = $( $( "#"+id ).html() ); //actually i'm using here sg like this: _.template( $( "#template-dialog" ).html(), propObject );
			dialog
				.dialog({
					close: function(){
					console.log( "dialogClose", this, arguments );
				}
				})
				.appendTo( document.body );
			$.mobile.changePage( dialog, { transition: "flip", role: "dialog", reverse: false } );
		};
		
		$( function () {
			document.addEventListener("deviceready", onDeviceReady, false);
		});
		
		function reachableCallback(reachability) {
			var networkState = reachability.code || reachability;
			var states = {};
			states[NetworkStatus.NOT_REACHABLE] = 'No network connection';
			states[NetworkStatus.REACHABLE_VIA_CARRIER_DATA_NETWORK] = 'Carrier data connection';
			states[NetworkStatus.REACHABLE_VIA_WIFI_NETWORK] = 'WiFi connection';
			
			if(networkState != 0) 
				online = true;
		}
		
		function onSuccess( position ) {
			coords = position.coords;
			positionFlag = true;
			getFeatureFeed(1);
		}
		
		function onError () {
			positionFlag = false;
			getFeatureFeed(1);
		}
		
		// PhoneGap is loaded and it is now safe to make calls PhoneGap methods
		function onDeviceReady() {
			navigator.geolocation.getCurrentPosition(onSuccess, onError);
			navigator.network.isReachable('google.com', reachableCallback, {});
		}

