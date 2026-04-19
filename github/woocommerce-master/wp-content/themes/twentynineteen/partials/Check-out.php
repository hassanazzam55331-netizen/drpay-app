 <style>
        h1, h2, h3, h4, h5 {
            font-family: 'Titillium Web', sans-serif;
        }

        h2 {
            color: #f6931e;
            font-weight: 500;
            margin: 0.5em 0;
            padding: 0;
            font-size: 22px;
        }

        h3 {
            font-size: 15px;
        }

        .panel {
            margin-bottom: 10px;
        }

        .modal-header {
            border-bottom: 2px solid #f6931e !important;
        }
    </style>
<!-- <div class="container-fluid">
<div class="container animated fadeInRight full-height">
<div class="row white-bg">
<div style="background-color:#2f4050; height:10px;">&nbsp;</div>
<div class="col-sm-12 col-lg-12 col-md-12 col-xs-12">
<h2>CHECKOUT</h2>
</div>
</div>
<div class="row white-bg">
<div class="wrapper-content">
<div class="col-lg-12">
<h3></h3>
</div>
<div id="div_Message" style="display: none;"></div>
<div class="col-lg-4 col-md-4">
<h4>NAME &amp; ADDRESS</h4>
<div class="row">
<div class="col-lg-6 col-md-6">

<span class="red_asteric">*</span> First Name

<input id="firstname" name="First Name" type="text" class="form-control m-b" required="" value="<?php //echo $firstname;?>">

</div>
<div class="col-lg-6 col-md-6">

<span class="red_asteric">*</span> Last Name

<input id="lastname" name="Last Name" type="text" class="form-control m-b-sm" required="" value="<?php //echo $lastname;?>">

</div>
<div class="clearfix"></div>
<div class="col-lg-6 col-md-6">

Company

<input id="company" name="Company" type="text" class="form-control m-b-sm">

</div>
<div class="col-lg-6 col-md-6">

<span class="red_asteric">*</span> Email Address

<input id="emailaddress" name="Email Address" type="email" class="form-control m-b-sm" value="<?php //echo $email;?>">

</div>
<div class="col-lg-12 col-md-12">

Address

<input id="emailaddress1" name="Email Address 1" type="text" class="form-control m-b-sm">
<input id="emailaddress2" name="Email Address 2" type="text" class="form-control m-b-sm">

</div>
<div class="col-lg-6 col-md-6">

City

<input id="city" name="City" type="text" class="form-control m-b-sm">

</div>
<div class="col-lg-6 col-md-6">

State / Province

<input id="State-Province" name="State Province" type="text" class="form-control m-b-sm">

</div>
<div class="col-lg-6 col-md-6">

 Zip Code

<input id="Zip-Code" name="Zip Code" type="text" class="form-control m-b-sm">

</div>
<div class="col-lg-6 col-md-6">

 Country

<input id="Country" name="Country" type="text" class="form-control m-b-sm">

</div>
<div class="col-lg-6 col-md-6">

<span class="red_asteric">*</span> Mobile

<input id="mobile" name="Telephone" type="text" class="form-control m-b-sm" value="<?php //echo $mobile;?>" > 

</div>
<div class="col-lg-6 col-md-6">

FAX

<input id="FAX" name="FAX" type="text" class="form-control m-b-sm">

</div>
<div class="col-lg-12 col-md-12">
<div class="bg">
<div class="chiller_cb">
                                        <input id="Create-Account" type="checkbox" checked="">
<label for="Create-Account"> Create an account for later use</label>
<span></span></div>
<div class="chiller_cb">
                                        <input id="Ship-Address" type="checkbox">
<label for="Ship-Address"> Ship to this address</label>
<span></span>

</div>
<div class="space-15"></div>
</div>
</div>
</div>
</div>
<div class="col-lg-4 col-md-4">
<h4>SHIPPING METHOD</h4>
<div class="row">
<div class="col-lg-12 col-md-12">

Local Shipment
<div class="bg">
<div class="chiller_cb">
                                        <input id="Free-Shipping" type="checkbox">
<label for="Free-Shipping"> Free Shipping Rs.0</label>
<span></span></div>
</div>
</div>
</div>
</div>
<div class="col-lg-4">
<h4>PAYMENT METHOD</h4>
<div class="row select_prod">
<div class="clearfix"></div>
<div id="activate">
<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    <label id="rdo_connectpay">
<input type="radio" name="test" value="ConnectPay">
<span class="span_btn">ConnectPay</span>
</label></div>
<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    <img src="images/ConnectPayLogo.png"></div>
</div>
<div class="clearfix"></div>
<div id="activate">
<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    <label id="rdo_cashondelivery">
<input type="radio" name="test" value="TCS">
<span class="span_btn">Cash On Delivery</span>
</label></div>
<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    <img src="images/TCS-Logo.png"></div>
</div>
<div class="clearfix"></div>
<div id="activate">
<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    <label id="rdo_onlinepayment">
<input type="radio" name="test" value="Online Payment">
<span class="span_btn">Online Payment</span>
</label></div>
<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    <img src="images/Credit-Card-Logo.png"></div>
</div>
<div class="clearfix"></div>
<div id="activate">
<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    <label id="rdo_easypaisa">
<input type="radio" name="test" value="Easy Pay">
<span class="span_btn">Easy Paisa</span>
</label></div>
<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    <img src="images/Easy-Pay-Logo.png"></div>
</div>
<div class="clearfix"></div>
@*
<div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                                    <img src="images/ConnectPay.png" alt=""></div>
<div class="col-lg-7 col-md-7 col-sm-7 col-xs-7 m-t-sm">
                                    <input id="CashOnDelivery" class="btn btn-default black-bg txt-white" type="button" value="ConnectPay"></div>
<div class="clearfix"></div>
<div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                                    <img src="images/TCS-Logo.png" alt=""></div>
<div class="col-lg-7 col-md-7 col-sm-7 col-xs-7 m-t-sm">
                                    <input id="CashOnDelivery" class="btn btn-default black-bg txt-white" type="button" value="CASH ON DELIVERY"></div>
<div class="clearfix"></div>
<div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                                    <img src="images/Credit-Card-Logo.png" alt=""></div>
<div class="col-lg-7 col-md-7 col-sm-7 col-xs-7 m-t-sm">
                                    <input id="CashOnDelivery" class="btn btn-default black-bg txt-white" type="button" value="ONLINE PAYMENT"></div>
<div class="clearfix"></div>
<div class="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                                    <img src="images/Easy-Pay-Logo.png" alt=""></div>
<div class="col-lg-7 col-md-7 col-sm-7 col-xs-7 m-t-sm">
                                    <input id="CashOnDelivery" class="btn btn-default black-bg txt-white" type="button" value="EASY PAISA"></div>
*@
<div class="clearfix"></div>
<div class="panel-body">
<fieldset class="col-md-12">
<legend>PAYMENT DISCLAIMER</legend>Please ensure:
<ul>
    <li>Card holder's details match their respective issuing bank details</li>
    <li>Card holder's issuing bank honors terms-national transactions.</li>
</ul>
</fieldset>
<div class="clearfix"></div>
<div class="row">
<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 m-t-sm">
<div class="chiller_cb">
                                            <input id="Newsletter" type="checkbox" checked="">
<label for="Newsletter"> Sign Up for Newsletter</label>
<span></span></div>
</div>
</div> -->


<div class="row">
<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 m-t">
                                        <input data-toggle="modal" type="button" id="place_order" class="btn btn-primary" value="Pay Using ConnectPay">
<div class="modal fade" id="orderSummaryModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
<div class="modal-dialog">
'<div class="modal-content popup-bg">
<div class="modal-header p-xs">
                                                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
<!--<img src="images/BankLogo.jpg" width="200" alt=""></div>-->
<!-- content goes here -->
<div class="row">
<div class="p-sm">
<div class="col-lg-8 col-md-8 col-xs-12 col-sm-12">
<div class="panel border-dashed text-center p-md" style="
    border: 2px dashed #f6931e;
    border-radius: 10px;
    background-color: #F1F1F1;">
<h2 class="text-gray font-size-22"><b>ConnectPay ID</b></h2>
<h2 class="font-size-26" id="pConsumerNumber"><b></b></h2>
</div>
</div>
<div class="col-lg-4 col-md-4 col-xs-12 col-sm-12 text-center">
<h4 id="h4message">Session expires in:</h4>
<div class="col-lg-offset-2 col-xs-offset-3 col-lg-10 col-md-10 col-xs-12 col-sm-12">
<div class="stopwatch" id="demo" data-timer="180" style="width: 120px; height: 120px;"></div>
</div>
<div class="orderMessage">
<h3 id="h2Message"></h3>
</div>
</div>
<div class="spacer"></div>
<div class="col-lg-12 col-md-12 col-xs-12 col-sm-12 order_summ">
<fieldset>
                                                                    <legend class="modal-title orange-text" id="lineModalLabel"> ORDER SUMMARY</legend>
<div class="spacer"></div>
<div class="col-lg-3 col-md-3 col-xs-12 col-sm-12 nopadding-5">
<h3>Merchant Name</h3>
</div>
<div class="col-lg-3 col-md-3 col-xs-12 col-sm-12 nopadding-5">

Bareeze Man

</div>
<div class="col-lg-3 col-md-3 col-xs-12 col-sm-12 nopadding-5">
<h3>Customer Name</h3>
</div>
<div id="pCustomerName" class="col-lg-3 col-md-3 col-xs-12 col-sm-12 nopadding-5"><b>
  
    </b></div>
<div class="clearfix"></div>
<div class="col-lg-3 col-md-3 col-xs-12 col-sm-12 nopadding-5">
<h3>Description</h3>
</div>
<div class="col-lg-9 col-md-9 col-xs-12 col-sm-12 nopadding-5">

Items purchased

</div>
<div class="clearfix"></div>
<div class="col-lg-3 col-md-3 col-xs-12 col-sm-12 m-t-sm nopadding-5">
<h3>Order Amount</h3>
</div>
<div class="col-lg-6 col-md-6 col-xs-12 col-sm-12 nopadding-5">
<h2 id="pOrderAmount"><sup>PKR.</sup> <b><?php if(isset($orderamount)){echo $orderamount;}?></b></h2>
</div>
<div class="clearfix"></div>
<div class="col-lg-6 col-md-6 col-xs-12 col-sm-12 nopadding-5">
<h3>View Your Cart Here</h3>
</div>
<div class="clearfix"></div>
<div class="table_scroll">
<table class="table table-hover table-fixed">
<thead>
<tr>
<th class="col-xs-3">S No.</th>
<th class="col-xs-3">Description</th>
<th class="col-xs-6">Amount</th>
</tr>
</thead>
<tbody>
<tr>
<td class="col-xs-3">01.</td>
<td class="col-xs-3">Clothes</td>
<td class="col-xs-6"><sup>PKR</sup> 2533.00</td>
</tr>
<tr>
<td class="col-xs-3">02.</td>
<td class="col-xs-3">Shoes</td>
<td class="col-xs-6"><sup>PKR</sup> 1508.00</td>
</tr>
<tr>
<td class="col-xs-3">03.</td>
<td class="col-xs-3">Electronics</td>
<td class="col-xs-6"><sup>PKR</sup> 2698.00</td>
</tr>
<tr>
<td class="col-xs-3">04.</td>
<td class="col-xs-3">Jewellery</td>
<td class="col-xs-6"><sup>PKR</sup> 4325.00</td>
</tr>
<tr>
<td class="col-xs-3">05.</td>
<td class="col-xs-3">Grocery</td>
<td class="col-xs-6"><sup>PKR</sup> 1984.00</td>
</tr>
<tr>
<td class="col-xs-3">06.</td>
<td class="col-xs-3">Mobiles</td>
<td class="col-xs-6"><sup>PKR</sup> 1765.00</td>
</tr>
</tbody>
</table>
</div>
<div class="spacer"></div></fieldset>
</div>
<div class="clearfix"></div>
<div class="col-lg-12 col-md-12 col-xs-12 col-sm-12 p-sm">
<fieldset>
                                                                    <legend class="orange-text">HOW TO PAY</legend>
<div class="howtopay">
<ul>
    <li> 1 - Log in to your internet banking portal <a href="https://connectpay.com.pk/#partnersbank" target="_blank" rel="noopener noreferrer"> (How to?) </a></li>
    <li> 2 - Select ConnectPay from Bill Payment Menu</li>
    <li> 3 - Enter Consumer Id</li>
    <li> 4 - Confirm details and pay</li>
</ul>
</div></fieldset>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>