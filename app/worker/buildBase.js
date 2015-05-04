'use strict';

var config = require('../../config/config'),
    _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    rest = require('restler');

require('../models/playersBase.server.model.js');
require('../models/teamCompBase.server.model.js');

var PlayersBase = mongoose.model('PlayersBase');
var TeamCompBase = mongoose.model('TeamCompBase');


module.exports = function(day, player, callback) {
    var region = player.region.toLowerCase();

    async.waterfall([
        function(callback) {
            var url = 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v1.3/game/by-summoner/' + player.id + '/recent?&api_key=' + config.leagueKey;
            rest.get(url).on('complete', function(recentGames) {
                if (recentGames instanceof Error) {
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
                if (game && typeof game.fellowPlayers !== 'undefined') {
                    // game.fellowPlayers.forEach(function(fellowPlayer) {
                    //     allPlayers.push(fellowPlayer.summonerId);
                    // });
                    var team100 = _.pluck(_.filter(game.fellowPlayers, {
                        teamId: 100
                    }), 'championId');
                    var team200 = _.pluck(_.filter(game.fellowPlayers, {
                        teamId: 200
                    }), 'championId');

                    var win100 = false;
                    if (game.teamId === 100) {
                        team100.push(game.championId);
                        win100 = game.stats.win;
                    } else {
                        team200.push(game.championId);
                        win100 = !game.stats.win;
                    }
                    team100 = _.sortBy(team100.map(Number));
                    team200 = _.sortBy(team200.map(Number));

                    parsedGames.push({
                        team200: team200,
                        team100: team100,
                        win100: win100
                    });
                }
            });
            //allPlayers = _.uniq(allPlayers);
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


