		var online = navigator.onLine || false;
		var coords = null;
		var positionFlag = false;

		function getvenues() {
			$.mobile.changePage("#venuesPage", "slideup", false, false);
			getWSFeed(2,2,'venuelist');
		}
		
		function gethome() {
			$.mobile.changePage("#mainpage", "slideup", false, false);
			getWSFeed(1,1,'showlist');
		}
		
		function getcomedian() {
			$.mobile.changePage("#comedianPage", "slideup", false, false);
			//getWSFeed(3,2,'comedianlist');
		}
		
		function getcalendar() {
			$.mobile.changePage("#calendarPage", "slideup", false, false);
			getWSFeed(4,1,'calendarlist');
		}
		
		$(document).ready( function () {
			var style = 2;
			var tab = 3;
			var tagID = 'showlist'
			var getURL = "http://www.ticketmob.com/PhoneGap/index.cfm?mode=1"+"&style="+style+"&tab="+tab;
			$.ajax({
				type: "GET",
				url: getURL,
				data: {
					mode: '0'
				},
				dataType: "jsonp",
				success: function(result){
					$('#'+tagID).html(result.html);
					if(style == 1)
						$('#'+tagID).find("ul").listview();
					else if (style == 2)
						$('#'+tagID).find('div[data-role="collapsible"]').collapsible({theme:'c',refresh:true});
				}
			});
		});

		function getWSFeed(style, tab, tagID) {
			if(positionFlag && coords != null)
				var getURL = "http://www.ticketmob.com/PhoneGap/index.cfm?lat="+coords.latitude+"&lon="+coords.longitude+"&style="+style+"&tab="+tab;
			else
				var getURL = "http://www.ticketmob.com/PhoneGap/index.cfm?lat=0&lon=0"+"&style="+style+"&tab="+tab;

			$.ajax({
				type: "GET",
				url: getURL,
				data: {
					mode: '0'
				},
				dataType: "jsonp",
				success: function(result){
					$('#'+tagID).html(result.html);
					if(style == 1)
						$('#'+tagID).find("ul").listview();
					else if (style == 2)
						$('#'+tagID).find('div[data-role="collapsible"]').collapsible({theme:'c',refresh:true});
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
			getWSFeed(1,1,'showlist');
		}
		
		function onError () {
			positionFlag = false;
			getWSFeed(1,1,'showlist');
		}
		
		// PhoneGap is loaded and it is now safe to make calls PhoneGap methods
		function onDeviceReady() {
			navigator.geolocation.getCurrentPosition(onSuccess, onError);
			navigator.network.isReachable('google.com', reachableCallback, {});
		}

