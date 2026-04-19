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
      /*   jQuery.ajax({
        type: "POST",
        url: "http://localhost:8080/wordpress/wp-admin/admin-ajax.php",
        data: {
            action: 'mark_message_as_read',
            // add your parameters here
            message_id: jQuery('#billing_last_name').val()
        },
        success: function (output) {
           console.log(output);
        }
        });*/
        jQuery("#h2Message").text("Your Session has expired");
        jQuery("#demo").hide();
    }

jQuery("form.woocommerce-checkout").on('submit', function () {
  debugger;
    if( jQuery("input[name='payment_method']:checked").val()=='cpay'){
        jQuery('#place_order1').click();
    
  

        var FirstName = jQuery('#billing_first_name').val();
        var LastName = jQuery('#billing_last_name').val(); 
    var OrderAmount = jQuery('.woocommerce-Price-amount').text().substring(39,45);
    var utc = new Date().toJSON().slice(0,10).replace(/-/g,'');
    /*Object.defineProperty(Date.prototype, 'YYYYMMDDHHMMSS', {
    value: function() {
        function pad2(n) {  // always returns a string
            return (n < 10 ? '0' : '') + n;
        }

        return this.getFullYear() +
               pad2(this.getMonth() + 1) + 
               pad2(this.getDate()) +
               pad2(this.getHours()) +
               pad2(this.getMinutes()) +
               pad2(this.getSeconds());
    }
});
 
    var utc=new Date().YYYYMMDDHHMMSS();*/
    var Orderid = utc+jQuery('#billing_phone').val();
    var email = jQuery('#billing_email').val();
    var phone =jQuery('#billing_phone').val();
        //var mobile = jQuery('#mobile').val(); 
        //var email = jQuery('#emailaddress').val();
         if(jQuery('.woocommerce-Price-amount').text().substring(39,45)==""){
            OrderAmount=500;
        }
         jQuery.ajax({
                type: "POST",
                url:'https://connectpay.com.pk:555/cpay/co?oJson={OrderNumber:petsone'+Orderid+',MerchantId:Petsone.pk,MerchantPassword:petsone.pk424,OrderAmount:'+OrderAmount+',OrderAmountPaid:0,OrderAmountRemaining:'+OrderAmount+',OrderDueDate:12/02/2018,OrderAmountWithinDueDate:'+OrderAmount+',OrderAmountAfterDueDate:'+OrderAmount+',OrderTypeId:Service,OrderType:Service,IssueDate:12/02/2018,DatePaid:,Reserved:,TransactionStatus:UNPAID,ReasonType:,Reason:,CustomerName:'+FirstName+',CustomerMobile:'+phone+',CustomerEmail:'+email+',CustomerAddress:,CustomerBank:,Field_01:,Field_02:,Field_03:,Field_04:,Field_05:,Field_06:,Field_07:,Field_08:}',
                dataType:"json",
                
                cache: false,
                success: function(result){
                    var connectPayId1 = result[0].ConnectPayId.substring(0, 4);
                    var connectPayId2 = result[0].ConnectPayId.substring(4, 8);
                    var connectPayId3 = result[0].ConnectPayId.substring(8, 12);
                    var connectPayId4 = result[0].ConnectPayId.substring(12, 16);
                   // var connectPayId = 2134+ " " + 2123 + " " + 4122+ " " + 4212;

                    jQuery("#pCustomerName").text(FirstName+ " "+ LastName);
                    jQuery("#pConsumerNumber").find("b").text(result[0].ConnectPayId);
                    //var orderAmountS = orderAmount.toLocaleString(orderAmount);
                    jQuery("#pOrderAmount").find("b").text(OrderAmount+ " PKR");
                    jQuery("#orderSummaryModal").modal('show');
                    jQuery("#firstname").val("");
                    jQuery("#lastname").val("");
                    jQuery("#mobile").val("");
                    jQuery("#emailaddress").val("");
                    setTimer();
                    setTimeout(function () { blockOrder(result[0].ConnectPayId) }, 180000);
                    setElementsOnTimeOut();
                      function yourFunction(){
                                // do whatever you like here
                                 jQuery.get("https://connectpay.com.pk:557/cpay/gos?userName=Petsone.pk&password=petsone.pk424&cpayId="+ result[0].ConnectPayId+"", function(data){
                                  console.log(data[1]);
                                  if(data[1].OrderStatus=="Paid"){
                                    //magento place order logic here
                                    jQuery("#h2Message").text("Paid Successfully");
                                    jQuery("#demo").hide();

                                  }
                                });
                                setTimeout(yourFunction, 180000);
                            }

                            yourFunction();
 },
             fail: function(data){
               console.log('request failed' + data);
            }
        });
                
        }

});

});
