<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wordpress' );

/** MySQL database username */
define( 'DB_USER', 'root' );

/** MySQL database password */
define( 'DB_PASSWORD', '' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'RcC24*lD Go<e|n6y$,r7|^~fkr]XMZ2d|Voz?GNn2CV]SFXHA<*DIA5X.L7;-~t' );
define( 'SECURE_AUTH_KEY',  'o%~UgRx-NmU_L+.AkKYe^lK%%cdo.H.e96%oF7.otk;Ej(squs+c8Y,*Fxh?cZ_o' );
define( 'LOGGED_IN_KEY',    'GA=/Q==bb!L(T+Or>/LyV#<sChfd31sumT+0B>(8sL/-3!An$jVij%H|+o%7l&83' );
define( 'NONCE_KEY',        ' x>sI!J8[s_7_H5=~{@oH~&sRD5;>T AW2aJ.m>wv<OSTfVxQN]g_}A)qI.Qcc5x' );
define( 'AUTH_SALT',        'UN`0DS} 6*n(A-cjM=,0W:],Mup8O4wJqQ{|CV4KQ-B&C`03t}$kUz+* 5_HO)n3' );
define( 'SECURE_AUTH_SALT', '&vfB:0<]wfdr88aN%.[htX^0VBL.W*#n!Xt:u@&*l6i=6Mdza@3KRD$PF`@SY VP' );
define( 'LOGGED_IN_SALT',   '%)<9d}4`j-M=!A1]vd3ywWmr%jOmy/REKj``g3qG<@pAOSb=L&~,ZGhs|hRHzn.T' );
define( 'NONCE_SALT',       'Nw>[|irz:|y(~HTxHHx577~_|muyYCU/$U!j;*41{p,Q&G$Ceu4BdI_ F3_q>;>j' );

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define( 'WP_DEBUG', false );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( __FILE__ ) . '/' );
}

/** Sets up WordPress vars and included files. */
require_once( ABSPATH . 'wp-settings.php' );
