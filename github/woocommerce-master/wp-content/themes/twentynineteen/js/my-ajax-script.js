jQuery(document).ready(function(){

	 var idle_timer = jQuery('.stopwatch', window.parent.document);
    idle_timer = jQuery(".stopwatch").TimeCircles(
        {
            time: { Days: { show: false }, Hours: { show: false }, Minutes: { show: false }, Seconds: { color: "#f6931e" } },
            use_background: true,
            total_duration: 180,
            circle_bg_color: "#C0C8CF",
            start: false
        }).addListener(
        function (unit, value, total) {
            if (value == 30) {
                //idle_timer.data('timer', 15);
                jQuery('.stopwatch').TimeCircles({
                    time: {
                        Days: { show: false },
                        Hours: { show: false },
                        Minutes: { show: false },
                        Seconds: { color: '#FF0000' }
                    }
                });
            }
        }
    );
	function setElementsOnTimeOut() {


        setTimeout(function () { jQuery("#demo").hide() }, 180000);
        setTimeout(function () { jQuery("#h2Message").show() }, 180000);
        setTimeout(function () { jQuery("#h4message")[0].innerText = "" }, 180000);
        setTimeout(function () { idle_timer.stop(); }, 180000);
        setTimeout(function () { idle_timer.destroy(); }, 180000);
        
    }
	  function setTimer() {
        jQuery("#demo").show();
        idle_timer.start();
	  }
	
	function doAjaxRequest(type, url, parameterData, datatype, async) {
    var result = "";
    jQuery.ajax({
        type: type,
        url: url,
        data: parameterData,
        contentType: "application/json;",
        async: async,
        datatype: datatype,
        success: function (data) {
            result = data;
        },
        failure: function (data) {
            result = data;
        }
    });
    return result;
	}
	function blockOrder(connectPayId) {
        debugger;
        var result = doAjaxRequest('POST', 'https://connectpay.com.pk:555/Home/BlockOrder', JSON.stringify({ ConnectPayId: connectPayId }), 'json', false);
    }

jQuery('#place_order').click(function(e){
	debugger;
        var FirstName = jQuery('#'+my_ajax_object.fname).val();
	 	var LastName = jQuery('#'+my_ajax_object.lname).val(); 
	var OrderAmount = jQuery('#'+my_ajax_object.orderamount).val(); 
	 	//var mobile = jQuery('#mobile').val(); 
		//var email = jQuery('#emailaddress').val(); 
        jQuery.ajax({
                type: "POST",
                url:'https://connectpay.com.pk:555/cpay/co?oJson={OrderNumber:Woocommerce'+Math.random()+',MerchantId:bareezeman,MerchantPassword:p@ssw0rd,OrderAmount:123,OrderAmountPaid:12,OrderAmountRemaining:123,OrderDueDate:12/02/2018,OrderAmountWithinDueDate:123,OrderAmountAfterDueDate:123,OrderTypeId:Service,OrderType:Service,IssueDate:12/02/2018,DatePaid:,Reserved:,TransactionStatus:UNPAID,ReasonType:,Reason:,CustomerName:Usman,CustomerMobile:03333473872,CustomerEmail:mohammad.saleem@thksolutions.com,CustomerAddress:,CustomerBank:,Field_01:,Field_02:,Field_03:,Field_04:,Field_05:,Field_06:,Field_07:,Field_08:}',
                dataType:"json",
                
                cache: false,
                success: function(result){
					var connectPayId1 = result[0].ConnectPayId.substring(0, 4);
					var connectPayId2 = result[0].ConnectPayId.substring(4, 8);
					var connectPayId3 = result[0].ConnectPayId.substring(8, 12);
					var connectPayId4 = result[0].ConnectPayId.substring(12, 16);

					var connectPayId = connectPayId1 + " " + connectPayId2 + " " + connectPayId3 + " " + connectPayId4;

					jQuery("#pCustomerName").text(FirstName+ " "+ LastName);
					jQuery("#pConsumerNumber").find("b").text(connectPayId);
					//var orderAmountS = orderAmount.toLocaleString(orderAmount);
					jQuery("#pOrderAmount").find("b").text(OrderAmount);
					jQuery("#orderSummaryModal").modal('show');
					jQuery("#firstname").val("");
					jQuery("#lastname").val("");
					jQuery("#mobile").val("");
					jQuery("#emailaddress").val("");
					setTimer();
					setTimeout(function () { blockOrder(result[0].ConnectPayId) }, 180000);
               		setElementsOnTimeOut();
                }
        });
	
e.preventDefault();
});
	
});