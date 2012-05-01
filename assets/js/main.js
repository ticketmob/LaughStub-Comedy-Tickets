		var online = navigator.onLine || false;
		var coords = null;
		var positionFlag = false;
		var qty = null;
		var coupon = null;
		var buyFormVar = null;
		var buyDialogVar = null;
		var checkoutFormVar = null;
		var checkoutDialogVar = null;
		var completeFormVar = null;
		var completeDialogVar = null;
		

		function getvenues() {
			//$.mobile.changePage("#venuesPage", "slideup", false, false);
			hideAll();
			getWSFeed(2,2,'venuelist');
		}
		
		function gethome() {
			//$.mobile.changePage("#mainpage", "slideup", false, false);
			hideAll();
			getWSFeed(1,1,'showlist');
		}
		
		function getcomedian() {
			//$.mobile.changePage("#comedianPage", "slideup", false, false);
			hideAll();
			getWSFeed(2,3,'comedianlist');
		}
		
		function getcalendar() {
			//$.mobile.changePage("#calendarPage", "slideup", false, false);
			hideAll();
			getWSFeed(1,4,'calendarlist');
		}
		
		//$(document).bind( "pagebeforechange", function( e, data ) {
		//});
		
		function hideAll() {
			$('#showlist').html('');
			$('#venuelist').html('');
			$('#comedianlist').html('');
			$('#calendarlist').html('');
		}
		
		$(document).ready( function () {
			qty = $('#quantity');
			coupon = $('#coupon');
			buyFormVar = $('#submitBuy');
			contentBuyDialogVar = $('#contentBuyDialog');
			checkoutFormVar = $('#submitCheckout');
			checkoutDialogVar = $('#contentCheckout');
			completeDialogVar = $('#contentComplete');
			var url = $.mobile.path.parseUrl(window.location.href);
			if(url.hash != '') {
				contentBuyDialogVar.show();
				checkoutDialogVar.hide();
				completeDialogVar.hide();
			}
			$("#homeNavBar a").click(function(event){
				event.preventDefault();
				gethome();
			});
			$("#venueNavBar a").click(function(event){
				event.preventDefault();
				getvenues();
			});
			$("#comedianNavBar a").click(function(event){
				event.preventDefault();
				getcomedian();
			});
			$("#calendarNavBar a").click(function(event){
				event.preventDefault();
				getcalendar();
			});
			
			if(0) {
				var style = 1;
				var tab = 1;
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
							$('#'+tagID).find('div[data-role=collapsible-set]').collapsibleset({refresh:true});
					}
				});
			}
		});
		
		$(document).on('pageinit','[data-role=page]', function(){
			$('[data-position=fixed]').fixedtoolbar({ tapToggle:false });
		  	$.mobile.touchOverflowEnabled = true ;
		});
		
		var pageLoadingHTML = '<div class="loadingPage">Page is loading..... <br /><img src="assets/img/loading.gif"></div>';
		
		function getWSFeed(style, tab, tagID) {
			$('#'+tagID).html(pageLoadingHTML);
			if(positionFlag && coords != null)
				var getURL = "http://www.ticketmob.com/PhoneGap/index.cfm?lat="+coords.latitude+"&lon="+coords.longitude+"&style="+style+"&tab="+tab;
			else
				var getURL = "http://www.ticketmob.com/PhoneGap/index.cfm?lat=0&lon=0"+"&style="+style+"&tab="+tab;
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
						$('#'+tagID).find('div[data-role=collapsible-set]').collapsibleset({refresh:true});
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
			$.mobile.changePage( dialog, { transition: "slide", role: "dialog", reverse: false } );
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

		function clickBuy(showtimingid) {
			location.href = 'index.html?#buy&showtimingid='+showtimingid;
		}

		$('#submitBuy').live('submit', function (e) {
				e.preventDefault();
				
				var getURL = "http://www.ticketmob.com/phonegap/buy.cfm";
				
				$.ajax({
					type: "POST",
					url: getURL,
					data: buyFormVar.serialize(),
					dataType: "jsonp",
					success: function(result){
						contentBuyDialogVar.hide();
						var checkoutForm = result.html;
						var thisQty = checkoutForm.qty;
						var thisCoupon = checkoutForm.coupon;
						var thisShowTimingID = checkoutForm.showtimingid;
						var thisShowName = checkoutForm.showname;
						var thisShowTime = checkoutForm.showtime;
						var thisSubTotal = checkoutForm.subtotal;
						var thisDiscount = checkoutForm.discount;
						var thisServiceFee = checkoutForm.servicefee;
						var thisTax = checkoutForm.tax;
						var thisTotal = checkoutForm.total;
						
						$("#ck_showname").html(thisShowName);
						$("#ck_showtime").html(thisShowTime);
						$("#ck_qty").html(thisQty);
						$("#ck_subtotal").html(thisSubTotal);
						$("#ck_disc").html(thisDiscount);
						$("#ck_servicefee").html(thisServiceFee);
						$("#ck_tax").html(thisTax);
						$("#ck_total").html(thisTotal);

						$("#ckf_quantity").attr("value", thisQty);
						$("#ckf_coupon").attr("value", thisCoupon);
						$("#ckf_showtimingid").attr("value", thisShowTimingID);
						$("#ckf_subtotal").attr("value", thisSubTotal);
						$("#ckf_disc").attr("value", thisDiscount);
						$("#ckf_servicefee").attr("value", thisServiceFee);
						$("#ckf_tax").attr("value", thisTax);
						$("#ckf_total").attr("value", thisTotal);
						
						checkoutDialogVar.show();

						
					}
				});
		});
		
		$('#submitCheckout').live('submit', function (e) {
				var passFlag = true;
				$('#firstnameLabel').removeClass(MISSING)
				if($('#firstname').attr("value") == '') {
					passFlag = false;
					$('#firstnameLabel').addClass(MISSING)
				}
				if($('#lastname').attr("value") == '')
					passFlag = false;
				if($('#email').attr("value") == '')
					passFlag = false;
				if($('#zipcode').attr("value") == '')
					passFlag = false;
				if($('#ccnumber').attr("value") == '')
					passFlag = false;
				if($('#expmonth').attr("value") == '')
					passFlag = false;
				if($('#expyear').attr("value") == '')
					passFlag = false;
				if($('#cvv').attr("value") == '')
					passFlag = false;

				e.preventDefault();

				if(!passFlag) {
					
				} else {
					
					var getURL = "http://www.ticketmob.com/phonegap/checkout.cfm";
					
					$.ajax({
						type: "POST",
						url: getURL,
						data: checkoutFormVar.serialize(),
						dataType: "jsonp",
						success: function(result){
							buyDialogVar.hide();
							checkoutDialogVar.hide();
							var checkoutForm = result.html;
							var thisQty = checkoutForm.qty;
							var thisCoupon = checkoutForm.coupon;
							var thisShowTimingID = checkoutForm.showtimingid;
							var thisShowName = checkoutForm.showname;
							var thisShowTime = checkoutForm.showtime;
							var thisSubTotal = checkoutForm.subtotal;
							var thisDiscount = checkoutForm.discount;
							var thisServiceFee = checkoutForm.servicefee;
							var thisTax = checkoutForm.tax;
							var thisTotal = checkoutForm.total;
							var thisStatus = checkoutForm.status;
							/*
							$("#ck_showname").html(thisShowName);
							$("#ck_showtime").html(thisShowTime);
							$("#ck_qty").html(thisQty);
							$("#ck_subtotal").html(thisSubTotal);
							$("#ck_disc").html(thisDiscount);
							$("#ck_servicefee").html(thisServiceFee);
							$("#ck_tax").html(thisTax);
							$("#ck_total").html(thisTotal);
	
							$("#ckf_quantity").attr("value", thisQty);
							$("#ckf_coupon").attr("value", thisCoupon);
							$("#ckf_showtimingid").attr("value", thisShowTimingID);
							$("#ckf_subtotal").attr("value", thisSubTotal);
							$("#ckf_disc").attr("value", thisDiscount);
							$("#ckf_servicefee").attr("value", thisServiceFee);
							$("#ckf_tax").attr("value", thisTax);
							$("#ckf_total").attr("value", thisTotal);
							*/
							completeDialogVar.show();
	
							
						}
					});
				}
		});
		
		
		