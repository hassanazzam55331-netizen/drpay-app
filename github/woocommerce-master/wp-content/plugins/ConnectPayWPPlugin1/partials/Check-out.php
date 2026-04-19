<style>
        h1, h2, h3, h4, h5 {<br />
            font-family: 'Titillium Web', sans-serif;<br />
        }</p>
<p>        h2 {<br />
            color: #f6931e;<br />
            font-weight: 500;<br />
            margin: 0.5em 0;<br />
            padding: 0;<br />
            font-size: 22px;<br />
        }</p>
<p>        h3 {<br />
            font-size: 15px;<br />
        }</p>
<p>        .panel {<br />
            margin-bottom: 10px;<br />
        }</p>
<p>        .modal-header {<br />
            border-bottom: 2px solid #f6931e !important;<br />
        }<br />
    </style>
<div class="row">
<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 m-t">
                                        <input data-toggle="modal" type="button" id="place_order1" class="btn btn-primary" value="Pay Using ConnectPay" style="display:none">
<div class="modal fade bd-example-modal-lg" id="orderSummaryModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
<div class="modal-dialog modal-lg white-bg">
<div class="modal-content popup-bg">
<div class="modal-header p-xs">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
<img src="../wp-content/plugins/ConnectPayWPPlugin1/images/logow1link.png" alt=""></div>
<div class="checkout_panel">
<div class="row">
<div class="col-lg-5 col-md-5 col-xs-12 col-sm-12 b-r">
<div class="text-center p-md dark-bg">
<h2>CONNECTPAY ID</h2>
<div class="spacer"></div>
<h2 id="pConsumerNumber"><b></b></h2>
<div class="spacer"></div>
<h4 id="h4message">Session expires in:</h4>
<div class="col-lg-offset-3 col-xs-offset-3 col-lg-10 col-md-10 col-xs-12 col-sm-12">
<div id="demo" class="stopwatch" data-timer="180" style="width: 120px; height: 120px"></div>
</div>
<div class="orderMessage">
<h4 id="h2Message"></h4>
</div>
</div>
<div class="gray-bg p-xs">
                                    <form action="../">
<h3>Select Your Bank</h3>
<div class="spacer"></div>
<select name="myDestination" class="drpdwn-select m-b-sm">
<option value="https://ebanking.meezanbank.com/AmbitRetailFrontEnd/login">Meezan Bank</option>
<option value="https://www.bop.com.pk/">Bank Of Punjab</option>
<option value="https://netbanking.bankalfalah.com/ib/Login.aspx">Bank Al Falah</option>
<option value="https://online.mcb.com.pk/T001/channel.jsp">MCB</option>
<option value="https://www.jsbl.com/e-banking/online-banking/">JS Bank</option>
</select>
<input type="button" class="btn url-btn" value="GO!" onclick="ob = this.form.myDestination;window.open(ob.options[ob.selectedIndex].value)">
</form></div>
</div>
<div class="col-lg-7 col-md-7 col-xs-12 col-sm-12">
<h2 class="dark-bg p-xxs">HOW TO PAY</h2>
<div class="spacer"></div>
<div class="howtopay">
<ul>
    <li> Log in to your internet banking portal</li>
    <li> Select ConnectPay from Bill Payment Menu</li>
    <li> Enter ConnectPay Id</li>
    <li> Confirm details and pay</li>
</ul>
</div>
</div>
<div class="col-lg-7 col-md-7 col-xs-12 col-sm-12 order_summ">
<h2 class="dark-bg p-xxs" id="lineModalLabel"> ORDER SUMMARY</h2>
<div class="spacer"></div>
<div class="row">
<div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
<h3>Merchant Name</h3>
</div>
<div class="col-lg-8 col-md-8 col-xs-12 col-sm-12">

Petsone

</div>
</div>
<div class="row">
<div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
<h3>Customer Name</h3>
</div>
<div class="col-lg-8 col-md-8 col-xs-12 col-sm-12">
<p id="pCustomerName">Faisal Ahmed</p>

</div>
</div>
<div class="row">
<div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
<h3>Description</h3>
</div>
<div class="col-lg-8 col-md-8 col-xs-12 col-sm-12">

Items purchased

</div>
</div>
<div class="row">
<div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
<h3>Order Amount</h3>
</div>
<div class="col-lg-8 col-md-8 col-xs-12 col-sm-12">
<h2 id="pOrderAmount" class="dark-bg p-xxs"><b></b></h2>
</div>
</div>
<div class="spacer"></div>
</div>
</div>
</div>
<div class="clearfix"></div>
</div>
</div>
</div>
</div>


</div>