'use strict';

var mandrill = require('../services/mandrill');
var _utils = require('../_utils');
/**
 * Module dependencies.
 */
exports.index = function(req, res) {
    res.render('index', {
        user: req.user || null,
        request: req
    });
};

exports.contact = function(req, res) {

    if (!_utils.validateEmail(req.body.email)) {
        return res.status(400).send({
            message: 'Failure sending email. Please fill up proper email.'
        });
    }

    if (!req.body.text) {
        return res.status(400).send({
            message: 'Failure sending email. Please fill up message.'
        });
    }

    mandrill.send('Unknown', req.body.email, {
        email: 'leagueofdraft@gmail.com',
        name: 'LeagueOfDraft'
    }, 'From Contact Form', req.body.text, ['Contact Form']);

    res.status(200).send({
        message: 'Email has been sent. Thank You!'
    });

};