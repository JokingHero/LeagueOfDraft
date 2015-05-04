'use strict';

var _ = require('lodash');
var mongoose = require('mongoose'),
    TeamCompBase = mongoose.model('TeamCompBase'),
    championBase = require('../services/champions.json');

/**
 * Module dependencies.
 */

var championBaseLookup = {};
for (var i = 0; i < championBase.length; i++) {
    championBaseLookup[championBase[i].id] = championBase[i];
}

Array.prototype.extend = function(other_array) {
    if (other_array.length > 0) {
        other_array.forEach(function(v) {
            this.push(v);
        }, this);
    }
};

var prepareBans = function(bans) {
    var bansQuery = [{}];
    if (bans.length > 0) {
        for (var i = 0; i < bans.length; i++) {
            bansQuery.push({
                'champ1': {
                    '$ne': Number(bans[i])
                }
            });
            bansQuery.push({
                'champ2': {
                    '$ne': Number(bans[i])
                }
            });
            bansQuery.push({
                'champ3': {
                    '$ne': Number(bans[i])
                }
            });
            bansQuery.push({
                'champ4': {
                    '$ne': Number(bans[i])
                }
            });
            bansQuery.push({
                'champ5': {
                    '$ne': Number(bans[i])
                }
            });
        }
    }
    return bansQuery;
};

var prepareTeamChamps = function(matchTheseChamps) {
    var finalRestrictions;
    var champions = _.sortBy(matchTheseChamps.map(Number));
    switch (champions.length) {
        case 1:
            finalRestrictions = [{
                champ1: champions[0]
            }, {
                champ2: champions[0]
            }, {
                champ3: champions[0]
            }, {
                champ4: champions[0]
            }, {
                champ5: champions[0]
            }];
            break;
        case 2:
            finalRestrictions = [{
                $and: [{
                    champ1: champions[0]
                }, {
                    champ2: champions[1]
                }]
            }, {
                $and: [{
                    champ2: champions[0]
                }, {
                    champ3: champions[1]
                }]
            }, {
                $and: [{
                    champ3: champions[0]
                }, {
                    champ4: champions[1]
                }]
            }, {
                $and: [{
                    champ4: champions[0]
                }, {
                    champ5: champions[1]
                }]
            }, {
                $and: [{
                    champ1: champions[0]
                }, {
                    champ3: champions[1]
                }]
            }, {
                $and: [{
                    champ2: champions[0]
                }, {
                    champ4: champions[1]
                }]
            }, {
                $and: [{
                    champ3: champions[0]
                }, {
                    champ5: champions[1]
                }]
            }, {
                $and: [{
                    champ1: champions[0]
                }, {
                    champ4: champions[1]
                }]
            }, {
                $and: [{
                    champ2: champions[0]
                }, {
                    champ5: champions[1]
                }]
            }, {
                $and: [{
                    champ1: champions[0]
                }, {
                    champ5: champions[1]
                }]
            }];
            break;
        case 3:
            finalRestrictions = [{
                $and: [{
                    champ1: champions[0]
                }, {
                    champ2: champions[1]
                }, {
                    champ3: champions[2]
                }]
            }, {
                $and: [{
                    champ2: champions[0]
                }, {
                    champ3: champions[1]
                }, {
                    champ4: champions[2]
                }]
            }, {
                $and: [{
                    champ3: champions[0]
                }, {
                    champ4: champions[1]
                }, {
                    champ5: champions[2]
                }]
            }, {
                $and: [{
                    champ1: champions[0]
                }, {
                    champ3: champions[1]
                }, {
                    champ4: champions[2]
                }]
            }, {
                $and: [{
                    champ1: champions[0]
                }, {
                    champ4: champions[1]
                }, {
                    champ5: champions[2]
                }]
            }, {
                $and: [{
                    champ1: champions[0]
                }, {
                    champ2: champions[1]
                }, {
                    champ4: champions[2]
                }]
            }, {
                $and: [{
                    champ1: champions[0]
                }, {
                    champ2: champions[1]
                }, {
                    champ5: champions[2]
                }]
            }, {
                $and: [{
                    champ2: champions[0]
                }, {
                    champ4: champions[1]
                }, {
                    champ5: champions[2]
                }]
            }, {
                $and: [{
                    champ2: champions[0]
                }, {
                    champ3: champions[1]
                }, {
                    champ5: champions[2]
                }]
            }, {
                $and: [{
                    champ1: champions[0]
                }, {
                    champ3: champions[1]
                }, {
                    champ5: champions[2]
                }]
            }];
            break;
        case 4:
            finalRestrictions = [{
                $and: [{
                    champ1: champions[0]
                }, {
                    champ2: champions[1]
                }, {
                    champ3: champions[2]
                }, {
                    champ4: champions[3]
                }]
            }, {
                $and: [{
                    champ2: champions[0]
                }, {
                    champ3: champions[1]
                }, {
                    champ4: champions[2]
                }, {
                    champ5: champions[3]
                }]
            }, {
                $and: [{
                    champ1: champions[0]
                }, {
                    champ3: champions[1]
                }, {
                    champ4: champions[2]
                }, {
                    champ5: champions[3]
                }]
            }, {
                $and: [{
                    champ1: champions[0]
                }, {
                    champ2: champions[1]
                }, {
                    champ4: champions[2]
                }, {
                    champ5: champions[3]
                }]
            }, {
                $and: [{
                    champ1: champions[0]
                }, {
                    champ2: champions[1]
                }, {
                    champ3: champions[2]
                }, {
                    champ5: champions[3]
                }]
            }];
            break;
        default:
            finalRestrictions = [{}];
    }
    return finalRestrictions;
};

exports.specificPredictions = function(req, res) {

    var matchTheseChamps = req.body.purple;
    if (req.body.teamBlue) {
        matchTheseChamps = req.body.blue;
    }

    TeamCompBase.aggregate([{
            $match: {
                $and: prepareBans(req.body.bans)
            }
        }, {
            $match: {
                $or: prepareTeamChamps(matchTheseChamps)
            }
        }, {
            $unwind: '$stats'
        }, {
            $group: {
                _id: {
                    champ1: '$champ1',
                    champ2: '$champ2',
                    champ3: '$champ3',
                    champ4: '$champ4',
                    champ5: '$champ5'
                },
                wins: {
                    $sum: '$stats.wins'
                },
                games: {
                    $sum: '$stats.games'
                }
            }
        }, {
            $match: {
                games: {
                    $gte: 10
                }
            }
        }, {
            $project: {
                _id: '$_id',
                wins: '$wins',
                games: '$games',
                ratio: {
                    $divide: ['$wins', '$games']
                }
            }
        }, {
            $sort: {
                ratio: -1
            }
        }, {
            $limit: 100
        }],
        function(err, results) {
            if (err) {
                res.status(400).send(err);
            } else {
                var propositions = [];
                _.forEach(results, function(teamComp) {
                    var champIds = _.toArray(teamComp._id);
                    propositions.extend(champIds);
                });
                propositions = _.uniq(propositions);

                var filterIds = [0];
                filterIds.extend(req.body.purple);
                filterIds.extend(req.body.blue);
                filterIds.extend(req.body.bans);
                if (filterIds.length > 0) {
                    propositions = _.difference(propositions, filterIds.map(Number));
                }

                var finalPropositions = [];
                _.forEach(propositions, function(id) {
                    var proposition = JSON.parse(JSON.stringify(championBaseLookup[id]));
                    proposition.img = proposition.img + (Math.floor(Math.random() * proposition.graphicsCount) + 1) + '.jpg';
                    finalPropositions.push(proposition);
                });

                res.json(finalPropositions);
            }
        });
};
