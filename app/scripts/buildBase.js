'use strict';
process.env.NODE_ENV = 'development';


var schedule = require('node-schedule'),
    config = require('../../config/config'),
    _ = require('lodash'),
    async = require('async'),
    rest = require('restler'),
    mongoose = require('mongoose');

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

require('../models/playersBase.server.model.js');
require('../models/teamCompBase.server.model.js');

var PlayersBase = mongoose.model('PlayersBase');
var TeamCompBase = mongoose.model('TeamCompBase');

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

var getRecentGames = function(player, callback) {
    var region = player.region.toLowerCase();

    async.waterfall([
        function(callback) {
            var url = 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v1.3/game/by-summoner/' + player.id + '/recent?&api_key=' + config.leagueKey;
            rest.get(url).on('complete', function(recentGames) {
                console.log('[Riot API] Riot API recentGames called. %j', player.id);
                if (recentGames instanceof Error) {
                    console.log('[Error] Riot API recentGames Error: ', recentGames.message);
                    callback(recentGames, null);
                } else {
                    callback(null, recentGames.games);
                }
            });
        },
        function(recentGames, callback) {
            var allPlayers = [];
            var parsedGames = [];
            recentGames.forEach(function(game) {
                if (game && typeof game.fellowPlayers != 'undefined') {
                    game.fellowPlayers.forEach(function(fellowPlayer) {
                        allPlayers.push(fellowPlayer.summonerId);
                    });
                    //if (game.recentGames == "MATCHED_GAME" && game.gameMode == "CLASSIC" && game.subType == "RANKED_SOLO_5x5") {

                    var team100 = _.pluck(_.filter(game.fellowPlayers, {
                        teamId: 100
                    }), 'championId');
                    var team200 = _.pluck(_.filter(game.fellowPlayers, {
                        teamId: 200
                    }), 'championId');

                    var win100 = false;
                    if (game.teamId == 100) {
                        team100.push(game.championId);
                        win100 = game.stats.win;
                    } else {
                        team200.push(game.championId);
                        win100 = !game.stats.win;
                    };
                    team100 = _.sortBy(team100.map(Number));
                    team200 = _.sortBy(team200.map(Number));

                    parsedGames.push({
                        team200: team200,
                        team100: team100,
                        win100: win100
                    });
                    //}
                }
            });
            allPlayers = _.uniq(allPlayers);
            callback(null, parsedGames, allPlayers);
        },
        function(parsedGames, players, callback) {
            parsedGames.forEach(function(game) {
                //team100
                TeamCompBase.findOne({
                    champ1: game.team100[0] || 0,
                    champ2: game.team100[1] || 0,
                    champ3: game.team100[2] || 0,
                    champ4: game.team100[3] || 0,
                    champ5: game.team100[4] || 0
                }).exec(function(err, teamComp) {
                    if (err) {
                        console.log('[Error] Worker error. Team100 findOne: %j', err);
                    }
                    if (!teamComp) {
                        var newTeamComp = new TeamCompBase({
                            champ1: game.team100[0] || 0,
                            champ2: game.team100[1] || 0,
                            champ3: game.team100[2] || 0,
                            champ4: game.team100[3] || 0,
                            champ5: game.team100[4] || 0,
                            stats: [{
                                day: day,
                                wins: Number(game.win100),
                                games: 1
                            }]
                        });
                        newTeamComp.save(function(err, f) {
                            if (err) {
                                console.log('[Error]  Worker error. Team100 not saved: %j Error: %j', teamComp, err);
                            }
                            console.log('New TeamComp added.');
                        });
                    } else {
                        var elementIndex = _.findIndex(teamComp.stats, {
                            'day': day
                        });
                        if (game.wins100) {
                            teamComp.stats[elementIndex].wins++;
                        }
                        teamComp.stats[elementIndex].games++;

                        teamComp.save(function(err, f) {
                            if (err) {
                                console.log('[Error]  Worker error. Team100 not saved: %j Error: %j', teamComp, err);
                            }
                            console.log('TeamComp updated.');
                        });
                    }
                });
                //team200
                TeamCompBase.findOne({
                    champ1: game.team200[0] || 0,
                    champ2: game.team200[1] || 0,
                    champ3: game.team200[2] || 0,
                    champ4: game.team200[3] || 0,
                    champ5: game.team200[4] || 0
                }).exec(function(err, teamComp) {
                    if (err) {
                        console.log('[Error] Worker error. Team100 findOne: %j', err);
                    }
                    if (!teamComp) {
                        var newTeamComp = new TeamCompBase({
                            champ1: game.team100[0] || 0,
                            champ2: game.team100[1] || 0,
                            champ3: game.team100[2] || 0,
                            champ4: game.team100[3] || 0,
                            champ5: game.team100[4] || 0,
                            stats: [{
                                day: day,
                                wins: Number(!game.win100),
                                games: 1
                            }]
                        });
                        newTeamComp.save(function(err, f) {
                            if (err) {
                                console.log('[Error]  Worker error. Team200 not saved: %j Error: %j', teamComp, err);
                            }
                            console.log('New TeamComp added.');
                        });
                    } else {
                        var elementIndex = _.findIndex(teamComp.stats, {
                            'day': day
                        });
                        if (!game.wins100) {
                            teamComp.stats[elementIndex].wins++;
                        }
                        teamComp.stats[elementIndex].games++;

                        teamComp.save(function(err, f) {
                            if (err) {
                                console.log('[Error]  Worker error. Team200 not saved: %j Error: %j', teamComp, err);
                            }
                            console.log('TeamComp updated.');
                        });
                    }
                });
            });
            callback(null, players);
        },
        function(players, callback) {
            if (players.length > 0) {
                players.forEach(function(fellowPlayer) {
                    PlayersBase.findOneAndUpdate({
                        id: fellowPlayer,
                        region: region
                    }, {
                        updated: Date.now()
                    }, {
                        upsert: true
                    }, function(err, f) {
                        if (err) {
                            console.log('[Error]  Worker error. player not saved: %j Error: %j', player.id, err);
                        }
                    });
                });
            }
            callback(null);
        }
    ], function(err) {
        if (err) {
            console.log('[Error] Worker error: ', err.message);
            callback('Failed.', null);
        }
        callback(null, 'Player recent games fetched.');
    });
};

var rule = new schedule.RecurrenceRule();
var j = schedule.scheduleJob(rule, function() {

    PlayersBase.find().sort('-updated').limit(config.leagueRequestLimit).exec(

        function(err, players) {
            if (err) {
                console.log('[Error] PlayersBase find error:', err.message);
                return;
            }
            players.forEach(function(player) {
                getRecentGames(player, function(err, success) {
                    if (err) {
                        console.log('[Error] Failed to get recent games: %j', player.id)
                    }
                    if (success) {
                        console.log(success);
                    }
                });
            });
        });
});
