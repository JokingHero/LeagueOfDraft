'use strict';

var config = require('../../config/config');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(config.mandrill);
exports.send = function(fromName, fromEmail, to, subject, text, tags) {
    console.log(config);
    var message = {
        'html': null,
        'text': 'test',
        'subject': subject,
        'from_email': fromEmail,
        'from_name': fromName,
        'to': to
    };
    console.log(message);
    mandrill_client.messages.send({
        'message': message,
        'async': false,
        'ip_pool': null,
        'send_at': null
    }, function(result) {
        console.log('[Mandrill API] Mandrill API called. %j', result);
    }, function(e) {
        console.log(e);
        console.error('[Error] A mandrill error occurred: ' + e.name + ' - ' + e.message);
    });
};
