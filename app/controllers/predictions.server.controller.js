'use strict';

var _ = require('lodash');
var mongoose = require('mongoose'),
    TeamCompBase = mongoose.model('TeamCompBase');

/**
 * Module dependencies.
 */
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
            $limit: 10
        }],
        function(err, results) {
            if (err) {
                console.error(err);
            } else {
                console.log(results);
            }
        });

    var exampleResponse = [{
        'order': '1',
        'name': 'Ahri',
        'img': 'ahri' + (Math.floor(Math.random() * 5) + 1) + '.jpg',
        'worksWell': ['jax', 'irelia', 'akali'],
        'weakAgainst': ['leblanc', 'annie', 'talon'],
        'pros': ['Build in sustain', 'High burst damage, as well as sustained damage', 'Very high mobility with ultimate, great escape as well', 'Has one of the strongest CC in the game, Charm (E)', 'Low Cooldowns'],
        'cons': ['Squishy', 'Dependent on hitting skillshots', 'Dependent on having ultimate to be effective', 'Relatively weak in early laning phase', 'Has to land her Charm to get the most damage out of her skills']
    }, {
        'order': '2',
        'name': 'Kassadin',
        'worksWell': ['diana', 'leesin', 'aatrox'],
        'weakAgainst': ['talon', 'pantheon', 'zed'],
        'img': 'kassadin' + (Math.floor(Math.random() * 5) + 1) + '.jpg',
        'pros': ['Highly Mobile Versatile Assassin', 'Fairly Strong laning phase (forces opponent to start flask)', 'Great Map Pressure Post 6', 'Scales Phenomenally among the assassins'],
        'cons': ['Low Base damages', 'Ult is very mana intensive with stacks', 'Can be countered by AD mids']
    }, {
        'order': '3',
        'name': 'Jarvan IV',
        'worksWell': ['orianna', 'katarina', 'gnar'],
        'weakAgainst': ['yorick', 'shen', 'jax'],
        'img': 'jarvan' + (Math.floor(Math.random() * 7) + 1) + '.jpg',
        'pros': ['Strong snowball potential', 'Easy ganks for your jungler', 'E-Q combo gives an escape or an engage', 'Strong splitpushing potential'],
        'cons': ['Easy to gank when E-Q combo is down', 'Low damage against armor early', 'Can become useless if shut down in lane']
    }, {
        'order': '4',
        'name': 'Jax',
        'worksWell': ['pantheon', 'ryze', 'zilean'],
        'weakAgainst': ['malphite', 'renekton', 'singed'],
        'img': 'jax' + (Math.floor(Math.random() * 10) + 1) + '.jpg',
        'pros': ['Strong in 1v1 fights and with Bilgewater will win nearly every fight', 'Good crowd control', 'Beats most top laners', 'Tons of damage without much need for offensive items', 'Large Item pool'],
        'cons': ['Can be locked down in fights', 'No Sustain Early', 'Vulnerable without ultimate and Dodge', 'Relies on Attack speed for damage', 'Can get mana hungry if he abuses leap strike early', 'Mostly single target damage']
    }, {
        'order': '5',
        'name': 'Garen',
        'worksWell': ['teemo', 'pantheon', 'jayce'],
        'weakAgainst': ['malphite', 'renekton', 'singed'],
        'img': 'garen' + (Math.floor(Math.random() * 8) + 1) + '.jpg',
        'pros': ['Naturally tanky due to his W ability which grants armor and magic resistance on minion kills', 'Lots of regen for the laning phase with his passive which boosts his regen when out of combat', 'Heavy Burst with his full combo', 'Lots of mobility with his MS increase on his Q and his ability to escape slows with his E when activated', 'A lot of early game damage / burst'],
        'cons': ['Damage falls off late game', 'Laning phase can be countered by a lot of champions']
    }, {
        'order': '6',
        'name': 'Fiddlesticks',
        'worksWell': ['amumu', 'kennen', 'jarvan'],
        'weakAgainst': ['janna', 'xinzhao', 'alistar'],
        'img': 'fiddlesticks' + (Math.floor(Math.random() * 8) + 1) + '.jpg',
        'pros': ['Strong single target CC', 'Strong AoE CC', 'Great AoE Damage for a support champion', 'Passive reduction for MR so spells hit harder'],
        'cons': ['Very squishy gets blown up easily', 'Hard learning curve', 'Long cooldowns so use skills wisely']
    }];
    res.json(exampleResponse);
};

exports.currentStatic = function(req, res) {
    var exampleResponse = [{
        'order': '1',
        'name': 'Ahri',
        'img': 'ahri' + (Math.floor(Math.random() * 5) + 1) + '.jpg',
        'worksWell': ['jax', 'irelia', 'akali'],
        'weakAgainst': ['leblanc', 'annie', 'talon'],
        'pros': ['Build in sustain', 'High burst damage, as well as sustained damage', 'Very high mobility with ultimate, great escape as well', 'Has one of the strongest CC in the game, Charm (E)', 'Low Cooldowns'],
        'cons': ['Squishy', 'Dependent on hitting skillshots', 'Dependent on having ultimate to be effective', 'Relatively weak in early laning phase', 'Has to land her Charm to get the most damage out of her skills']
    }, {
        'order': '2',
        'name': 'Kassadin',
        'worksWell': ['diana', 'leesin', 'aatrox'],
        'weakAgainst': ['talon', 'pantheon', 'zed'],
        'img': 'kassadin' + (Math.floor(Math.random() * 5) + 1) + '.jpg',
        'pros': ['Highly Mobile Versatile Assassin', 'Fairly Strong laning phase (forces opponent to start flask)', 'Great Map Pressure Post 6', 'Scales Phenomenally among the assassins'],
        'cons': ['Low Base damages', 'Ult is very mana intensive with stacks', 'Can be countered by AD mids']
    }, {
        'order': '3',
        'name': 'Jarvan IV',
        'worksWell': ['orianna', 'katarina', 'gnar'],
        'weakAgainst': ['yorick', 'shen', 'jax'],
        'img': 'jarvan' + (Math.floor(Math.random() * 7) + 1) + '.jpg',
        'pros': ['Strong snowball potential', 'Easy ganks for your jungler', 'E-Q combo gives an escape or an engage', 'Strong splitpushing potential'],
        'cons': ['Easy to gank when E-Q combo is down', 'Low damage against armor early', 'Can become useless if shut down in lane']
    }, {
        'order': '4',
        'name': 'Jax',
        'worksWell': ['pantheon', 'ryze', 'zilean'],
        'weakAgainst': ['malphite', 'renekton', 'singed'],
        'img': 'jax' + (Math.floor(Math.random() * 10) + 1) + '.jpg',
        'pros': ['Strong in 1v1 fights and with Bilgewater will win nearly every fight', 'Good crowd control', 'Beats most top laners', 'Tons of damage without much need for offensive items', 'Large Item pool'],
        'cons': ['Can be locked down in fights', 'No Sustain Early', 'Vulnerable without ultimate and Dodge', 'Relies on Attack speed for damage', 'Can get mana hungry if he abuses leap strike early', 'Mostly single target damage']
    }, {
        'order': '5',
        'name': 'Garen',
        'worksWell': ['teemo', 'pantheon', 'jayce'],
        'weakAgainst': ['malphite', 'renekton', 'singed'],
        'img': 'garen' + (Math.floor(Math.random() * 8) + 1) + '.jpg',
        'pros': ['Naturally tanky due to his W ability which grants armor and magic resistance on minion kills', 'Lots of regen for the laning phase with his passive which boosts his regen when out of combat', 'Heavy Burst with his full combo', 'Lots of mobility with his MS increase on his Q and his ability to escape slows with his E when activated', 'A lot of early game damage / burst'],
        'cons': ['Damage falls off late game', 'Laning phase can be countered by a lot of champions']
    }, {
        'order': '6',
        'name': 'Fiddlesticks',
        'worksWell': ['amumu', 'kennen', 'jarvan'],
        'weakAgainst': ['janna', 'xinzhao', 'alistar'],
        'img': 'fiddlesticks' + (Math.floor(Math.random() * 8) + 1) + '.jpg',
        'pros': ['Strong single target CC', 'Strong AoE CC', 'Great AoE Damage for a support champion', 'Passive reduction for MR so spells hit harder'],
        'cons': ['Very squishy gets blown up easily', 'Hard learning curve', 'Long cooldowns so use skills wisely']
    }];
    res.json(exampleResponse);
};
