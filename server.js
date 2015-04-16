'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
    config = require('./config/config'),
    mongoose = require('mongoose'),
    schedule = require('node-schedule'),
    buildBase = require('./app/worker/buildBase'),
    chalk = require('chalk');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db.uri, config.db.options, function(err) {
    if (err) {
        console.error(chalk.red('Could not connect to MongoDB!'));
        console.log(chalk.red(err));
    }
});
mongoose.connection.on('error', function(err) {
    console.error(chalk.red('MongoDB connection error: ' + err));
    process.exit(-1);
});

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('--');
console.log(chalk.green(config.app.title + ' application started'));
console.log(chalk.green('Environment:\t\t\t' + process.env.NODE_ENV));
console.log(chalk.green('Port:\t\t\t\t' + config.port));
console.log(chalk.green('Database:\t\t\t' + config.db.uri));
if (process.env.NODE_ENV === 'secure') {
    console.log(chalk.green('HTTPs:\t\t\t\ton'));
}
console.log('--');



var day = 0; //0-30 - 31 days to iterate on
var dayRule = new schedule.RecurrenceRule();
dayRule.hour = 23; //every day at 23:59 we change day
dayRule.minute = 59;
var dayJob = schedule.scheduleJob(dayRule, function() {
    day = day + 1;
    if (day === 31) {
        day = 0;
    }

    // TeamCompBase.update({
    //     'stats.day': day
    // }, {
    //     $set: {
    //         'stats.wins': 0
    //     }
    // }, {
    //     multi: true
    // }, function(err, numAffected) {
    //     if (err) {
    //         console.log('[Error] DayJob error. Could not update: %j', err);
    //     }
    //     if (numAffected) {
    //         console.log('[DayJob] Updated %j documents.', numAffected);
    //     }
    // }));
});


var PlayersBase = mongoose.model('PlayersBase');
var rule = new schedule.RecurrenceRule();
var j = schedule.scheduleJob(rule, function() {

    PlayersBase.find().sort('-updated').limit(config.leagueRequestLimit).exec(

        function(err, players) {
            if (err) {
                console.log('[Error] PlayersBase find error:', err.message);
                return;
            }
            players.forEach(function(player) {
                buildBase.getRecentGames(day, player, function(err, success) {
                    if (err) {
                        console.log('[Error] Failed to get recent games: %j', player.id);
                    }
                });
            });
        });
});
