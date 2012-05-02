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
				var thisPage = $('#contentMainDialog').html();
				$('#contentMainDialog').html(pageLoadingHTML);
				var getURL = "http://www.ticketmob.com/PhoneGap/index.cfm?mode=1";
				$.ajax({
					type: "GET",
					url: getURL,
					data: {
						mode: '0'
					},
					dataType: "jsonp",
					success: function(result){
						$('#contentMainDialog').html ( result.featured );
						$('#contentMainDialog').find("ul").listview();
						$('#contentVenueDialog').html ( result.venues );
						$('#contentVenueDialog').find('div[data-role=collapsible-set]').collapsibleset({refresh:true});
						$('#contentComedianDialog').html ( result.comedian );
						$('#contentComedianDialog').find('div[data-role=collapsible-set]').collapsibleset({refresh:true});
						$('#contentCalendarDialog').html ( result.calendar );
						$('#contentCalendarDialog').find('div[data-role=collapsible-set]').collapsibleset({refresh:true});
					}
				});
				//$.mobile.changePage("#mainpage", "slide", false, false);
			}
		});
		
		// To remove the tap for full screen
		$(document).on('pageinit','[data-role=page]', function(){
			$('[data-position=fixed]').fixedtoolbar({ tapToggle:false });
		  	$.mobile.touchOverflowEnabled = true ;
		});
		
		var pageLoadingHTML = '<div class="loadingPage">Page is loading..... <br /><img src="assets/img/loading.gif"></div>';
		
		function getAllWSFeed() {
			var thisPage = $('#contentMainDialog').html();
			$('#contentMainDialog').html(pageLoadingHTML);
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
					$('#contentMainDialog').html(thisPage);
					$('#contentMainDialog').html ( result.featured );
					$('#contentMainDialog').find("ul").listview();
					$('#contentVenueDialog').html ( result.venues );
					$('#contentVenueDialog').find('div[data-role=collapsible-set]').collapsibleset({refresh:true});
					$('#contentComedianDialog').html ( result.comedian );
					$('#contentComedianDialog').find('div[data-role=collapsible-set]').collapsibleset({refresh:true});
					$('#contentCalendarDialog').html ( result.calendar );
					$('#contentCalendarDialog').find('div[data-role=collapsible-set]').collapsibleset({refresh:true});
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
			$("#f_showtimingid").attr("value", showtimingid);
			$("#f_venueid").attr("value", venueID);
			$("#tierInfo").html($("#tier"+showtimingid).html());
			$.mobile.changePage("#buy", "slide", false, false);
			$("#contentBuyDialog").find("ul").listview();
		}

		$('#searchShow').live('submit', function (e) {
			$.mobile.changePage("#showSearch", "slide", false, false);
		});
		
		$('#searchVenue').live('submit', function (e) {
			$.mobile.changePage("#venueSearch", "slide", false, false);
		});
		
		$('#searchShow').live('submit', function (e) {
			$.mobile.changePage("#searchShow", "slide", false, false);
		});
		
		$('#searchShow').live('submit', function (e) {
			$.mobile.changePage("#searchShow", "slide", false, false);
		});
		
		$('#submitBuy').live('submit', function (e) {
				//var thisPage = $('#contentBuyDialog').html();
				//$('#contentBuyDialog').html(pageLoadingHTML);
				$('#buyErrorMessageQty').html ('');
				$('#buyErrorMessage').html ('');
				e.preventDefault();
				var getURL = "http://www.ticketmob.com/phonegap/getticket.cfm";
				$.ajax({
					type: "POST",
					url: getURL,
					data: buyFormVar.serialize(),
					dataType: "jsonp",
					success: function(result){
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
						var thisShowTier = checkoutForm.showtier;
						var thisShowTierList = checkoutForm.showtierlist;
						
						//$('#contentBuyDialog').html(thisPage);
						if(thisCouponStatus != 'success') {
							if(thisCouponStatus == 'qty')
								$('#buyErrorMessageQty').html (thisStatusMessage);
							else
								$('#buyErrorMessage').html (thisStatusMessage);
						} else {
							$('#buyErrorMessage').html ('');
							$("#ck_showname").html(thisShowName);
							$("#ck_showtime").html(thisShowTime);
							$("#ck_qty").html(thisQty + ' ' + thisShowTier);
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
							$("#ckf_showtierlist").attr("value", thisShowTierList);
							$.mobile.changePage("#checkout", "slide", false, false);
						}
					}
				});
				$.mobile.changePage("#buy", "slide", false, false);
		});
		
		$('#submitCheckout').live('submit', function (e) {
				//var thisPage = $('#contentCheckout').html();
				//$('#contentCheckout').html(pageLoadingHTML);
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
							var thisBarCode = checkoutForm.barcode;

							//$('#contentCheckout').html(thisPage);
							if(thisStatus == 'success' || thisStatus == 'fail') {
								if(thisStatus == 'success') {
									$.mobile.changePage("#complete", "slide", false, false);
									$("#coupon").attr("value", '');
									$("#ccnumber").attr("value", '');
									$("#cvv").attr("value", '');
									$("#barcodeplace").html(thisBarCode);
								} else {
									$.mobile.changePage("#errCheckout", "slide", false, false);
								}
							} else {
							}
						}
					});
				}
				//$('#contentCheckout').html(thisPage);
		});
		
		
		