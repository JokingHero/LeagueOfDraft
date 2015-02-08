'use strict';

module.exports = {
	db: {
		uri: 'mongodb://localhost/mean-test',
		options: {
			user: '',
			pass: ''
		}
	},
	port: 3001,
	log: {
		// Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
		format: 'dev',
		// Stream defaults to process.stdout
		// Uncomment to enable logging to a log on the file system
		options: {
			//stream: 'access.log'
		}
	},
	mandrill: process.env.MANDRILL_APIKEY || 'dvifSXcwpPWLiwxWf5kULQ',
	app: {
		title: 'League Of Draft'
	}
};