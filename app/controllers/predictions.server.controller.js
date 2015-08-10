'use strict';

var _ = require('lodash'),
    config = require('../../config/config'),
    mongoose = require('mongoose'),
    rest = require('restler');

var RateLimiter = require('limiter').RateLimiter;
var limiter = new RateLimiter(config.leagueRequestLimit, 10000, true);

var PlayersBase = mongoose.model('PlayersBase');

/**
 * Module dependencies.
 */

Array.prototype.extend = function(other_array) {
    if (other_array.length > 0) {
        other_array.forEach(function(v) {
            this.push(v);
        }, this);
    }
};

exports.specificPredictions = function(req, res) {
    var standardTeamRoles = ['ADC', 'Middle', 'Top', 'Jungle', 'Support'];
    var propositions = [];
    var filterIds = [0];
    filterIds.extend(req.body.purple);
    filterIds.extend(req.body.blue);
    filterIds.extend(req.body.bans);

    var teamWith = req.body.teamBlue === true ? req.body.blue : req.body.purple;
    var teamAgainst = req.body.teamBlue === false ? req.body.blue : req.body.purple;

    propositions = _.filter(JSON.parse(JSON.stringify(GLOBAL.currentChampsBase)), function(
        proposition) {
        return filterIds.indexOf(proposition.id) === -1;
    });

    //filter by role
    if (req.body.gameRole !== 'Unknown') {
        propositions = _.filter(propositions, {
            'role': req.body.gameRole
        });
    }
    else {
        var teamMatesRoles = [];
        _.forEach(teamWith, function(teamMate) {
            var possibleRoles = _.filter(JSON.parse(JSON.stringify(GLOBAL.currentChampsBase)), {
                'id': teamMate
            });
            if (possibleRoles.length > 0) {
                possibleRoles = _.sortBy(possibleRoles, "playPercent").reverse();
                teamMatesRoles.push(possibleRoles[0].role);
            }
        });
        var rolesToTake = _.difference(standardTeamRoles, teamMatesRoles);
        propositions = _.filter(propositions, function(proposition) {
            return rolesToTake.indexOf(proposition.role) > -1;
        });
    }

    _.forEach(propositions, function(proposition) {
        proposition.img = proposition.img + (Math.floor(Math.random() * proposition.graphicsCount) +
            1) + '.jpg';
        //counterpicks winrate
        var counters = _.filter(proposition.counters, function(counter) {
            return teamAgainst.indexOf(counter.id) > -1;
        });

        if (counters.length > 0) {

            proposition.winPercent = _.reduce(counters, function(memo, counter) {
                return memo + counter.winRate;
            }, 0) / counters.length;

            if (proposition.winPercent < 50) {
                proposition.countered = true;
            }
        }
    });

    //winrates of player
    if (req.body.gameRegion !== 'Unknown' && req.body.gameSummoner !== 'Unknown') {

        limiter.removeTokens(1, function(err, remainingRequests) {
            if (remainingRequests < 0) {
                PlayersBase.findOne({
                        $or: [{
                            'region': req.body.gameRegion
                        }, {
                            'summoner': req.body.gameSummoner.replace(/\s/g,
                                '').toLowerCase()
                        }]
                    },
                    function(err, playerData) {
                        if (err) {
                            console.log('[MongoDB] Error: %j', err);
                            propositions = _.sortBy(propositions, "winPercent").reverse();
                            res.json(propositions);
                        }
                        else {
                            _.forEach(propositions, function(proposition) {
                                if (!proposition.countered) {
                                    var index = _.findIndex(playerData.champions, {
                                        'id': proposition.id
                                    });
                                    if (index !== -1) {
                                        proposition.winPercent = playerData
                                            .champions[index].winPercent;
                                    }
                                }
                            });
                            propositions = _.sortBy(propositions, "winPercent").reverse();
                            res.json(propositions);
                        }
                    });
            }
            else {
                var getId = 'https://' + req.body.gameRegion + '.api.pvp.net/api/lol/' +
                    req.body.gameRegion + '/v1.4/summoner/by-name/' +
                    encodeURIComponent(req.body.gameSummoner.toLowerCase()) +
                    '?api_key=' + config.leagueKey;
                rest.get(getId).on('complete', function(response) {
                    if (response instanceof Error || typeof response ===
                        "string" || response instanceof String) {
                        propositions = _.sortBy(propositions, "winPercent").reverse();
                        res.json(propositions);
                    }
                    else {

                        var player = {
                            id: response[req.body.gameSummoner.replace(
                                /\s/g, '').toLowerCase()].id,
                            summoner: req.body.gameSummoner.replace(/\s/g,
                                '').toLowerCase(),
                            region: req.body.gameRegion,
                            champions: []
                        };
                        var getStatsByChamp = 'https://' + req.body.gameRegion +
                            '.api.pvp.net/api/lol/' + req.body.gameRegion +
                            '/v1.3/stats/by-summoner/' + player.id +
                            '/ranked?season=SEASON2015&api_key=' + config.leagueKey;
                        rest.get(getStatsByChamp).on('complete', function(
                            response) {
                            if (response instanceof Error || typeof response ===
                                "string" || response instanceof String) {
                                console.log('[RIOT API] Error: %j',
                                    response);
                                propositions = _.sortBy(propositions,
                                    "winPercent").reverse();
                                res.json(propositions);
                            }
                            else {

                                _.forEach(response.champions, function(
                                    champion) {
                                    if (champion.stats.totalSessionsPlayed >
                                        10) {
                                        player.champions.push({
                                            id: champion
                                                .id,
                                            winPercent: champion
                                                .stats.totalSessionsWon *
                                                100 /
                                                champion
                                                .stats.totalSessionsPlayed
                                        });
                                    }
                                });

                                PlayersBase.findOneAndUpdate({
                                        id: player.id
                                    },
                                    player, {
                                        upsert: true
                                    },
                                    function(err) {
                                        if (err) {
                                            console.log(
                                                '[MongoDB] Error: %j',
                                                err);
                                        }
                                    }
                                );

                                //change propositions
                                _.forEach(propositions, function(
                                    proposition) {
                                    if (!proposition.countered) {
                                        var index = _.findIndex(
                                            player.champions, {
                                                'id': proposition
                                                    .id
                                            });

                                        if (index !== -1) {
                                            proposition.winPercent =
                                                player.champions[
                                                    index].winPercent;
                                        }
                                    }
                                });

                                //send response
                                res.json(propositions);
                            }
                        });
                    }
                });
            }
        });
    }
    else {
        res.json(propositions);
    }
};