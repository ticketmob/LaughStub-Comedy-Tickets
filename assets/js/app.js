/*
function loader() {
	var state = document.readyState;
	if(state == 'loaded' || state == 'complete') {
		runGeoLoc();
	} else {
		if(navigator.userAgent.indexOf('Browzr') > 1) {
			setTimeout(runGeoLoc, 250);
		} else {
			document.addEventListener('deviceready', runGeoLoc, false);
		}
	}
}

function runGeoLoc() {
	nativeControls = window.plugins.nativeControls;
	//nativeControls.createTabBar();
	//nativeControls.createTabBarItem(
	//	"home", "Home", "lsIcon.png", {"onSelect": function() {
	//	}}
	//);
	var win = function (position) {
		var coords = positin.coords;
		var url = "http://maps.google.com/maps/api/staticmap?center=" + coords.latitude + "," + coords.longitude + "&zoom=13&size=320x480&maptype=roadmap&key=MyGoogleMapsAPIKey&sensor=true";
	}
	var fail = function (e) {
		alert('Can\'t retrieve position.\nError: ' + e);
	};
	alert(navigator.geolocation.getCurrentPosition);
	navigator.geolocation.getCurrentPosition(win, fail);
}
*/

function loaded() {
	document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
	alert('device ready');
}

// 
//  --- our app behavior logic ---
//
run(function () {
    // immediately invoked on first run
    var init = (function () {
        if (navigator.network.connection.type == Connection.NONE) {
            alert("No internet connection - we won't be able to show you any maps");
        } else {
            //alert("We can reach Google - get ready for some awesome maps!");
			navigator.geolocation.getCurrentPosition(function (position) {
				var coords = position.coords;
				var location = "" + position.coords.latitude + "," + position.coords.longitude;
				var url = "http://maps.google.com/maps/api/staticmap?center=" + coords.latitude + "," + coords.longitude + "&zoom=13&size=320x480&maptype=roadmap&key=MyGoogleMapsAPIKey&sensor=true";
	
				store.save( {
					key: 'configLoc',
					location: location,
					lat: position.coords.latitude,
					lon: position.coords.longitude
				});

				}, function () {
					alert('Can\'t locate the position');
			});
			//nativeControls = window.plugins.nativeControls;
			//nativeControls.createTabBar();
			//alert('here');
			//nativeControls.createTabBarItem(
			//	"home", "Home", "lsIcon.png", {"onSelect": function() {
			//	}}
			//);
        }
    })();
    
    // a little inline controller
    when('#welcome', function() {
	});
    when('#settings', function() {
		// load settings from store and make sure we persist radio buttons.
		store.get('config', function(saved) {
			if (saved) {
				if (saved.map) {
					x$('input[value=' + saved.map + ']').attr('checked',true);
				}
				if (saved.zoom) {
					x$('input[name=zoom][value="' + saved.zoom + '"]').attr('checked',true);
				}
			}
		});
	});
    when('#map', function () {
        store.get('config', function (saved) {
            // construct a gmap str
            var map  = saved ? saved.map || ui('map') : ui('map')
            ,   zoom = saved ? saved.zoom || ui('zoom') : ui('zoom')
            ,   path = "http://maps.google.com/maps/api/staticmap?center=";
			
            navigator.geolocation.getCurrentPosition(function (position) {
                var location = "" + position.coords.latitude + "," + position.coords.longitude;
                path += location + "&zoom=" + zoom;
                path += "&size=250x250&maptype=" + map + "&markers=color:red|label:P|";
                path += location + "&sensor=false";

                x$('img#static_map').attr('src', path);

            }, function () {
                x$('img#static_map').attr('src', "assets/img/gpsfailed.png");
            });
        });
    });
    when('#save', function () {
        store.save({
            key:'config',
            map:ui('map'),
            zoom:ui('zoom')
            //lat:ui('lat'),
            //lon:ui('lon'),
            //location:ui('location')
        });
        display('#welcome');
    });

	when('#shows', function () {
		$('#showlist').html('Page is loading....');
		store.get('configLoc', function (savedLoc) {
			var location = savedLoc ? savedLoc.location : 0
				,   lat = savedLoc ? savedLoc.lat : 0
				,   lon = savedLoc ? savedLoc.lon : 0
				,   path = "http://maps.google.com/maps/api/staticmap?center=";
			$.ajax({
				type: "GET",
				url: "http://www.ticketmob.com/PhoneGap/index.cfm?location="+location+"&lat="+lat+"&lon="+lon,
				data: {
					showID: '0'
				},
				dataType: "html",
				success: function(result){
					$('#showlist').html(result);
				}
			});
		});
    });

	when('#welcome1', function () {
		display('#welcome');
    });

});
