'use strict';

module.exports = {
	db: {
		uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/mean',
		options: {
			user: '',
			pass: ''
		}
	}, 
	log: {
		// Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
		format: 'combined',
		// Stream defaults to process.stdout
		// Uncomment to enable logging to a log on the file system
		options: {
			stream: 'access.log'
		}
	},
	mandrill: process.env.MANDRILL_APIKEY || 'dvifSXcwpPWLiwxWf5kULQ',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.min.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
				'public/lib/fontawesome/css/font-awesome.min.css',
				'public/lib/slider-pro/dist/css/slider-pro.min.css',
				'public/lib/ngDialog/css/ngDialog.min.css',
				'public/lib/ngDialog/css/ngDialog-theme-plain.min.css'
			],
			js: [
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/jquery-ui/jquery-ui.min.js',
				'public/lib/angular/angular.min.js',
				'public/lib/angular-resource/angular-resource.min.js',
				'public/lib/angular-animate/angular-animate.min.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
				'public/lib/angular-dragdrop/src/angular-dragdrop.min.js',
				'public/lib/slider-pro/dist/js/jquery.sliderPro.min.js',
				'public/lib/jquery-ui-touch-punch/jquery.ui.touch-punch.min.js',
				'public/lib/ngDialog/js/ngDialog.min.js',
				'public/lib/bootstrap/js/tooltip.js'
			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	}
};
