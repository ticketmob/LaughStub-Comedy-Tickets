		var online = navigator.onLine || false;
		var coords = null;
		var positionFlag = false;
		var qty = null;
		var coupon = null;
		var buyFormVar = null;
		//var buyDialogVar = null;
		var checkoutFormVar = null;
		//var checkoutDialogVar = null;
		//var completeFormVar = null;
		//var completeDialogVar = null;
		

		$(document).ready( function () {
			qty = $('#quantity');
			coupon = $('#coupon');
			buyFormVar = $('#submitBuy');
			//contentBuyDialogVar = $('#contentBuyDialog');
			checkoutFormVar = $('#submitCheckout');
			//checkoutDialogVar = $('#contentCheckout');
			//completeDialogVar = $('#contentComplete');
			//contentBuyDialogVar.show();
			//checkoutDialogVar.show();
			//completeDialogVar.show();
			
			if(0) {
				$.mobile.changePage("#loadingPage", "slide", false, false);
				var getURL = "http://www.ticketmob.com/PhoneGap/index.cfm?mode=1";
				$.ajax({
					type: "GET",
					url: getURL,
					data: {
						mode: '0'
					},
					dataType: "jsonp",
					success: function(result){
						$('#showlist').html ( result.featured );
						$('#showlist').find("ul").listview();
						$('#venuelist').html ( result.venues );
						$('#venuelist').find('div[data-role=collapsible-set]').collapsibleset({refresh:true});
						$('#comedianlist').html ( result.comedian );
						$('#comedianlist').find('div[data-role=collapsible-set]').collapsibleset({refresh:true});
						$('#calendarlist').html ( result.calendar );
						$('#calendarlist').find('div[data-role=collapsible-set]').collapsibleset({refresh:true});
					}
				});
				$.mobile.changePage("#mainpage", "slide", false, false);
			}
		});
		
		// To remove the tap for full screen
		$(document).on('pageinit','[data-role=page]', function(){
			$('[data-position=fixed]').fixedtoolbar({ tapToggle:false });
		  	$.mobile.touchOverflowEnabled = true ;
		});
		
		var pageLoadingHTML = '<div class="loadingPage">Page is loading..... <br /><img src="assets/img/loading.gif"></div>';
		
		function getAllWSFeed() {
			$.mobile.changePage("#loadingPage", "slide", false, false);
			if(positionFlag && coords != null)
				var getURL = "http://www.ticketmob.com/PhoneGap/index.cfm?lat="+coords.latitude+"&lon="+coords.longitude;
			else
				var getURL = "http://www.ticketmob.com/PhoneGap/index.cfm?lat=0&lon=0";
			//var getURL = "http://www.ticketmob.com/PhoneGap/index.cfm?mode=1";
			//alert(getURL);
			$.ajax({
				type: "GET",
				url: getURL,
				data: {
					mode: '0'
				},
				dataType: "jsonp",
				success: function(result){
					$('#showlist').html ( result.featured );
					$('#showlist').find("ul").listview();
					$('#venuelist').html ( result.venues );
					$('#venuelist').find('div[data-role=collapsible-set]').collapsibleset({refresh:true});
					$('#comedianlist').html ( result.comedian );
					$('#comedianlist').find('div[data-role=collapsible-set]').collapsibleset({refresh:true});
					$('#calendarlist').html ( result.calendar );
					$('#calendarlist').find('div[data-role=collapsible-set]').collapsibleset({refresh:true});
				}
			});
			$.mobile.changePage("#mainpage", "slide", false, false);
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
			getAllWSFeed();
		}
		
		function onError () {
			positionFlag = false;
			getAllWSFeed();
		}
		
		// PhoneGap is loaded and it is now safe to make calls PhoneGap methods
		function onDeviceReady() {
			navigator.geolocation.getCurrentPosition(onSuccess, onError);
			navigator.network.isReachable('google.com', reachableCallback, {});
		}

		function clickBuy(showtimingid, venueID) {
			$.mobile.changePage("#buy", "slide", false, false);
			$("#f_showtimingid").attr("value", showtimingid);
			$("#f_venueid").attr("value", venueID);
		}

		$('#submitBuy').live('submit', function (e) {
				$.mobile.changePage("#loadingPage", "slide", false, false);
				e.preventDefault();
				var getURL = "http://www.ticketmob.com/phonegap/getticket.cfm";
				$.ajax({
					type: "POST",
					url: getURL,
					data: buyFormVar.serialize(),
					dataType: "jsonp",
					success: function(result){
						//contentBuyDialogVar.hide();
						var checkoutForm = result.html;
						var thisVenueID = checkoutForm.venueid;
						var thisSourceID = checkoutForm.sourceid;
						var thisQty = checkoutForm.qty;
						var thisCoupon = checkoutForm.coupon;
						var thisCoupondID = checkoutForm.couponid;
						var thisCouponStatus = checkoutForm.couponstatus;
						var thisStatusMessage = checkoutForm.statusmessage;
						var thisShowTimingID = checkoutForm.showtimingid;
						var thisShowName = checkoutForm.showname;
						var thisShowTime = checkoutForm.showtime;
						var thisSubTotal = checkoutForm.subtotal;
						var thisDiscount = checkoutForm.discount;
						var thisServiceFee = checkoutForm.servicefee;
						var thisTax = checkoutForm.tax;
						var thisTotal = checkoutForm.total;
						
						if(thisCouponStatus != 'success') {
							$('#buyErrorMessage').html (thisStatusMessage);
							//contentBuyDialogVar.show();
						} else {
							$('#buyErrorMessage').html ('');
							$.mobile.changePage("#checkout", "slide", false, false);
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
							$("#ckf_couponid").attr("value", thisCoupondID);
							$("#ckf_showtimingid").attr("value", thisShowTimingID);
							$("#ckf_subtotal").attr("value", thisSubTotal);
							$("#ckf_disc").attr("value", thisDiscount);
							$("#ckf_servicefee").attr("value", thisServiceFee);
							$("#ckf_tax").attr("value", thisTax);
							$("#ckf_total").attr("value", thisTotal);
							$("#ckf_showname").attr("value", thisShowName);
							$("#ckf_showtime").attr("value", thisShowTime);
							$("#ckf_venueid").attr("value", thisVenueID);
							$("#ckf_sourceid").attr("value", thisSourceID);
							
							//checkoutDialogVar.show();
						}
					}
				});
				$.mobile.changePage("#checkout", "slide", false, false);
		});
		
		$('#submitCheckout').live('submit', function (e) {
				$.mobile.changePage("#loadingPage", "slide", false, false);
				var passFlag = true;
				$('#firstnameLabel').removeClass('missing')
				$('#lastnameLabel').removeClass('missing')
				$('#emailLabel').removeClass('missing')
				$('#ccnumberLabel').removeClass('missing')
				$('#cvvLabel').removeClass('missing')
				var additionalMsg = '';
				var missingMsg = 'Missing required fields';
				if($('#firstname').attr("value") == '') {
					passFlag = false;
					$('#firstnameLabel').addClass('missing')
				}
				if($('#lastname').attr("value") == '') {
					passFlag = false;
					$('#lastnameLabel').addClass('missing')
				}
				var thisEmail = $('#email').attr("value");
				if( thisEmail == '') {
					passFlag = false;
					$('#emailLabel').addClass('missing')
				}
				var emailRegex = new RegExp(/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/i);
				if(thisEmail != '' && !emailRegex.test(thisEmail)) {
					passFlag = false;
					additionalMsg += '\nEmail address is not valid';
				}
				if($('#ccnumber').attr("value") == '') {
					passFlag = false;
					$('#ccnumberLabel').addClass('missing')
				}
				if($('#cvv').attr("value") == '') {
					passFlag = false;
					$('#cvvLabel').addClass('missing')
				}
				e.preventDefault();
				var getURL = "http://www.ticketmob.com/phonegap/checkout.cfm";
				
				if(!passFlag) {
					if(additionalMsg != '')
						missingMsg += additionalMsg;
					alert(missingMsg);
				} else {
					$.ajax({
						type: "POST",
						url: getURL,
						data: checkoutFormVar.serialize(),
						dataType: "jsonp",
						success: function(result){
							//checkoutDialogVar.hide();
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
							var thisStatusMessage = checkoutForm.statusMessage;

							if(thisStatus == 'success' || thisStatus == 'fail') {
								if(thisStatus == 'success') {
									$.mobile.changePage("#complete", "slide", false, false);
									$("#coupon").attr("value", '');
									$("#ccnumber").attr("value", '');
									$("#cvv").attr("value", '');
								} else {
									$.mobile.changePage("#errCheckout", "slide", false, false);
								}
							} else {
							}
						}
					});
				}
		});
		
		
		