<?php
/**
 * Plugin Name: ConnectPay
 * Plugin URI: https://connectpay.com.pk/
 * Description: An eCommerce toolkit that helps you sell anything. Beautifully.
 * Version: 3.5.6
 * Author: Automattic
 * Author URI: https://connectpay.com.pk
 * Text Domain: woocommerce
 * Domain Path: /i18n/languages/
 *
 * @package WooCommerce
 */
add_action('wp_enqueue_scripts', 'callback_for_setting_up_scripts');
function callback_for_setting_up_scripts() {
    wp_register_style( 'style', '/wp-content/plugins/ConnectPayWPPlugin1/Connectpaycss/bootstrap.min.css' );
	 wp_register_style( 'style1', '/wp-content/plugins/ConnectPayWPPlugin1/Connectpaycss/animate.css' );
	 wp_register_style( 'style3', '/wp-content/plugins/ConnectPayWPPlugin1/Connectpaycss/fon-family_Open_Sans.css' );
	 wp_register_style( 'style4', '/wp-content/plugins/ConnectPayWPPlugin1/Connectpaycss/fon-family_Roboto.css' );
	 wp_register_style( 'style2', '/wp-content/plugins/ConnectPayWPPlugin1/Connectpaycss/style.css' );
	 wp_register_style( 'style5', '/wp-content/plugins/ConnectPayWPPlugin1/Connectpaycss/TimeCircles.css' );
	wp_register_style( 'style6', '/wp-content/plugins/ConnectPayWPPlugin1/Connectpaycss/timer.css' );
		wp_register_style( 'style7', 'https://fonts.googleapis.com/css?family=Titillium+Web' );
    wp_enqueue_style('style');
	  wp_enqueue_style('style1');
	  wp_enqueue_style('style2');
	  wp_enqueue_style('style3');
	  wp_enqueue_style('style4');
	  wp_enqueue_style('style5');
	  wp_enqueue_style('style7');
	wp_enqueue_script( 'jquery', '/wp-content/plugins/ConnectPayWPPlugin1/Connectpayjs/jquery.min.js', array( 'jquery' ) );
	wp_enqueue_script( 'bootstrap', '/wp-content/plugins/ConnectPayWPPlugin1/Connectpayjs/bootstrap.min.js');
	wp_enqueue_script( 'TimeCircles', '/wp-content/plugins/ConnectPayWPPlugin1/Connectpayjs/TimeCircles.js');
	
}
   

global $woocommerce;  
wp_enqueue_script( 'ajax-script1', plugin_dir_url( __FILE__ ) . '/js/my-ajax-script.js', array('jquery') );
   
add_action( 'plugins_loaded', 'init_your_gateway_class' );
function init_your_gateway_class() {
    class WC_Gateway_Your_Gateway extends WC_Payment_Gateway {
        
         public function __construct() {

            $this->domain = 'custom_payment';

            $this->id                 = 'cpay';
            $this->icon               = apply_filters('woocommerce_custom_gateway_icon', '');
            $this->has_fields         = false;
            $this->method_title       = __( 'Connectpay', $this->domain );
            $this->method_description = __( 'Allows payments with connectpay system.', $this->domain );

            // Load the settings.
            $this->init_form_fields();
            $this->init_settings();

            // Define user set variables
            $this->title        = $this->get_option( 'title' );
            $this->description  = $this->get_option( 'description' );
            $this->instructions = $this->get_option( 'instructions', $this->description );
            $this->order_status = $this->get_option( 'order_status', 'completed' );

            // Actions
            add_action( 'woocommerce_update_options_payment_gateways_' . $this->id, array( $this, 'process_admin_options' ) );
            add_action( 'woocommerce_thankyou_custom', array( $this, 'thankyou_page' ) );

            // Customer Emails
            add_action( 'woocommerce_email_before_order_table', array( $this, 'email_instructions' ), 10, 3 );
        }
        
          public function init_form_fields() {

            $this->form_fields = array(
                'enabled' => array(
                    'title'   => __( 'Enable/Disable', $this->domain ),
                    'type'    => 'checkbox',
                    'label'   => __( 'Enable Custom Payment', $this->domain ),
                    'default' => 'yes'
                ),
                'title' => array(
                    'title'       => __( 'Title', $this->domain ),
                    'type'        => 'text',
                    'description' => __( 'This controls the title which the user sees during checkout.', $this->domain ),
                    'default'     => __( 'Custom Payment', $this->domain ),
                    'desc_tip'    => true,
                ),
                'order_status' => array(
                    'title'       => __( 'Order Status', $this->domain ),
                    'type'        => 'select',
                    'class'       => 'wc-enhanced-select',
                    'description' => __( 'Choose whether status you wish after checkout.', $this->domain ),
                    'default'     => 'wc-completed',
                    'desc_tip'    => true,
                    'options'     => wc_get_order_statuses()
                ),
                'description' => array(
                    'title'       => __( 'Description', $this->domain ),
                    'type'        => 'textarea',
                    'description' => __( 'Payment method description that the customer will see on your checkout.', $this->domain ),
                    'default'     => __('Payment Information', $this->domain),
                    'desc_tip'    => true,
                ),
                'instructions' => array(
                    'title'       => __( 'Instructions', $this->domain ),
                    'type'        => 'textarea',
                    'description' => __( 'Instructions that will be added to the thank you page and emails.', $this->domain ),
                    'default'     => '',
                    'desc_tip'    => true,
                ),
            );
        }
function process_payment( $order_id ) {
    global $woocommerce;
    $order = new WC_Order( $order_id );

    // Mark as on-hold (we're awaiting the cheque)
    $order->update_status('on-hold', __( 'Awaiting cheque payment', 'woocommerce' ));

    // Reduce stock levels
    $order->reduce_order_stock();

    // Remove cart
    $woocommerce->cart->empty_cart();
    sleep(180);
    // Return thankyou redirect
   return array(
        'result' => 'success',
        'redirect' => $this->get_return_url( $order )
    );
}
        
        
    }
}

function add_your_gateway_class( $methods ) {
    $methods[] = 'WC_Gateway_Your_Gateway'; 
    return $methods;
}

add_filter( 'woocommerce_payment_gateways', 'add_your_gateway_class' );

add_action('woocommerce_checkout_process', 'change_product_upon_submission');
function change_product_upon_submission() {
    
 
}
add_filter('woocommerce_get_return_url','override_return_url',10,2);

function override_return_url($return_url,$order){

    //create empty array to store url parameters in 
    $sku_list = array();

    // retrive products in order
    foreach($order->get_items() as $key => $item)
    {
      $product = wc_get_product($item['product_id']);
      //get sku of each product and insert it in array 
      $sku_list['product_'.$item['product_id'] . 'sku'] = $product->get_sku();
    }
    //build query strings out of the SKU array
    $url_extension = http_build_query($sku_list);
    //append our strings to original url
    $modified_url = $return_url.'&'.$url_extension;

    return $modified_url;

  }


add_action( 'woocommerce_admin_order_data_after_billing_address', 'my_custom_checkout_field_display_admin_order_meta1', 10, 2 );

function my_custom_checkout_field_display_admin_order_meta1($order){

    echo '<p><strong>'.__('ConnectPay Order Id').':</strong> <br/>' . get_post_meta( $order->get_id(), 'connectpayid', true ) . '</p>';
}

add_action( 'woocommerce_checkout_update_order_meta', 'my_custom_checkout_field_update_order_meta' );

function my_custom_checkout_field_update_order_meta( $order_id) {
   
    $order = wc_get_order( $order_id );

    $order_data = $order->get_data(); 
   // $phone = substr($order_data['billing']['phone'], -4);
    $phone = $order_data['billing']['phone'];
        update_post_meta( $order_id, 'connectpayid', "Petsone".date("Ymd").$phone);
    
}
function my_form_shortcode2( $atts) {
    ob_start();
       
    include(plugin_dir_path( __FILE__ ) .'partials/check-out.php');
 
            
      
return ob_get_clean();   
} 
add_shortcode( 'connectpay', 'my_form_shortcode2',11 );