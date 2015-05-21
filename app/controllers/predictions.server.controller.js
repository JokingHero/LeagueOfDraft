'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
//TeamCompBase = mongoose.model('TeamCompBase');

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

    propositions = _.filter(JSON.parse(JSON.stringify(GLOBAL.currentChampsBase)), function(proposition) {
        return filterIds.indexOf(proposition.id) === -1;
    });

    //filter by role
    if (req.body.gameRole !== 'Unknown') {
        propositions = _.filter(propositions, {
            'role': req.body.gameRole
        });
    } else {
        var teamMatesRoles = [];
        _.forEach(teamWith, function(teamMate) {
            var possibleRoles = _.filter(JSON.parse(JSON.stringify(GLOBAL.currentChampsBase)), {
                'id': teamMate
            });
            possibleRoles = _.sortBy(possibleRoles, "playPercent").reverse();
            teamMatesRoles.push(possibleRoles[0].role);
        });
        var rolesToTake = _.difference(standardTeamRoles, teamMatesRoles);
        propositions = _.filter(propositions, function(proposition) {
            return rolesToTake.indexOf(proposition.role) > -1;
        });
    }

    _.forEach(propositions, function(proposition) {
        proposition.img = proposition.img + (Math.floor(Math.random() * proposition.graphicsCount) + 1) + '.jpg';
        //counterpicks winrate
        var counters = _.filter(proposition.counters, function(counter) {
            return teamAgainst.indexOf(counter.id) > -1;
        });

        if (counters.length > 0) {
            proposition.winPercent = _.sortBy(counters, "winRate")[0].winRate;
            proposition.countered = true;
        }
        //winrates of player
    });
    propositions = _.sortBy(propositions, "winPercent").reverse();
    res.json(propositions);
};
