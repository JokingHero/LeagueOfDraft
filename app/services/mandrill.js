'use strict';

var config = require('../../../config/config');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(config.mandrill);

exports.send = function(fromName, fromEmail, to, subject, text, tags) {

    var message = {
        'html': true,
        'text': text,
        'subject': subject,
        'from_email': fromEmail,
        'from_name': fromName,
        'to': to,
        'tags': tags
    };

    mandrill_client.messages.send({
        'message': message
    }, function(result) {
        console.log('[Mandrill API] Mandrill API called. %j', result);
    }, function(e) {
        console.error('[Error] A mandrill error occurred: ' + e.name + ' - ' + e.message);
    });
};
