var fs = require('fs');
var JSONStream = require('JSONStream');
var es = require('event-stream');
var async = require('async');
var _ = require('lodash');
var json2csv = require('json2csv');

var fileName = 'matches10';

//my id 21778381
//https://eune.api.pvp.net/api/lol/eune/v2.2/matchhistory/21778381?beginIndex=1&endIndex=15&api_key=8d28d7b1-e50e-438c-845a-309f609cc31f

var leaguesToNumbers = {
    'CHALLENGER': 1,
    'MASTER': 2,
    'DIAMOND': 3,
    'PLATINUM': 4,
    'GOLD': 5,
    'SILVER': 6,
    'BRONZE': 7
};

var numbersToLeagues = {
    '1': 'CHALLENGER',
    '2': 'MASTER',
    '3': 'DIAMOND',
    '4': 'PLATINUM',
    '5': 'GOLD',
    '6': 'SILVER',
    '7': 'BRONZE'
};

function calculateMedian(values) {
    var filteredValues = values.filter(function(n) {
        return n != undefined
    });

    filteredValues.sort(function(a, b) {
        return a - b;
    });
    var half = Math.floor(filteredValues.length / 2);

    if (filteredValues.length % 2) {
        return filteredValues[half];
    }
    return filteredValues[half - 1]; // + values[half]) / 2.0; <- we take lower bracket instead

}

var getStream = function(fileName) {
    var jsonData = fileName,
        stream = fs.createReadStream(jsonData, {
            encoding: 'utf8'
        }),
        parser = JSONStream.parse('*');
    return stream.pipe(parser);
};

var decideGameType = function(queueType) {
    if (queueType === 'ODIN_UNRANKED') {
        return '5cs';
    }

    if (queueType === 'RANKED_SOLO_5x5' || 'RANKED_PREMADE_5x5') {
        return '5sr';
    }

    if (queueType === 'RANKED_TEAM_5x5') {
        return 'p5sr';
    }

    if (queueType === 'RANKED_SOLO_3x3' || 'RANKED_PREMADE_3x3') {
        return '3tt';
    }

    if (queueType === 'RANKED_TEAM_3x3') {
        return 'p3tt';
    }

    return queueType;
};

var shouldParse = function(gameMode, gameType) {
    if (gameMode === 'CLASSIC' || gameMode === 'ODIN' && gameType === 'MATCHED_GAME') {
        return true;
    }
    return false;
};

var agregatePlayersChampions = function(participants) {
    var championPicks = {
        'blue_adc': '',
        'blue_supp': '',
        'blue_jng': '',
        'blue_top': '',
        'blue_mid': '',
        'purple_adc': '',
        'purple_supp': '',
        'purple_jng': '',
        'purple_top': '',
        'purple_mid': '',
    };

    participants.forEach(function(participant) {
        if (participant.teamId === 100) {
            if ((participant.timeline.lane == 'MIDDLE' || participant.timeline.lane == 'MID') && participant.timeline.role == 'SOLO') {
                championPicks.blue_mid = participant.championId
            };
            if (participant.timeline.lane == 'TOP' && participant.timeline.role == 'SOLO') {
                championPicks.blue_top = participant.championId
            };
            if (participant.timeline.lane == 'JUNGLE' && participant.timeline.role == 'NONE') {
                championPicks.blue_jng = participant.championId
            };
            if ((participant.timeline.lane == 'BOTTOM' || participant.timeline.lane == 'BOT') && participant.timeline.role == 'DUO_CARRY') {
                championPicks.blue_adc = participant.championId
            };
            if ((participant.timeline.lane == 'BOTTOM' || participant.timeline.lane == 'BOT') && participant.timeline.role == 'DUO_SUPPORT') {
                championPicks.blue_supp = participant.championId
            };
        }
        if (participant.teamId === 200) {
            if (participant.timeline.lane == 'MIDDLE' && participant.timeline.role == 'SOLO') {
                championPicks.purple_mid = participant.championId
            };
            if (participant.timeline.lane == 'TOP' && participant.timeline.role == 'SOLO') {
                championPicks.purple_top = participant.championId
            };
            if (participant.timeline.lane == 'JUNGLE' && participant.timeline.role == 'NONE') {
                championPicks.purple_jng = participant.championId
            };
            if (participant.timeline.lane == 'BOTTOM' && participant.timeline.role == 'DUO_CARRY') {
                championPicks.purple_adc = participant.championId
            };
            if (participant.timeline.lane == 'BOTTOM' && participant.timeline.role == 'DUO_SUPPORT') {
                championPicks.purple_supp = participant.championId
            };
        }
    });

    return championPicks;
};

var agregatePlayersNames = function(allPlayers, identities) {
    identities.forEach(function(identity) {
        var search = _.find(allPlayers, {
            'summonerId': identity.player.summonerId
        });
        if (search === undefined) {
            var player = {
                'summonerId': identity.player.summonerId,
                'summonerName': identity.player.summonerName
            };
            console.log(player);
            allPlayers.push(player);
        }
    });
};

var agregateBans = function(teams) {
    var bans = [];
    if (teams[0].bans != undefined) {
        teams[0].bans.forEach(function(ban) {
            bans.push(ban.championId);
        });
    }
    if (teams[1].bans != undefined) {
        teams[1].bans.forEach(function(ban) {
            bans.push(ban.championId);
        });
    }
    return bans;
};

var decideLeague = function(participants) {
    var playerLeagues = [];
    participants.forEach(function(participant) {
        playerLeagues.push(leaguesToNumbers[participant.highestAchievedSeasonTier]);
    });
    var median = calculateMedian(playerLeagues);
    return numbersToLeagues[median];
};

var allGames = [];
var allPlayers = [];
getStream(fileName + '.json').pipe(es.mapSync(function(data) {
    data.forEach(function(game) {
        if (shouldParse) {
            var players = agregatePlayersChampions(game.participants);
            allGames.push({
                'id': game.matchId,
                'region': game.region,
                'gameType': decideGameType(game.queueType),
                'date': game.matchCreation,
                'blue_adc': players.blue_adc,
                'blue_supp': players.blue_supp,
                'blue_jng': players.blue_jng,
                'blue_top': players.blue_top,
                'blue_mid': players.blue_mid,
                'purple_adc': players.purple_adc,
                'purple_supp': players.purple_supp,
                'purple_jng': players.purple_jng,
                'purple_top': players.purple_top,
                'purple_mid': players.purple_mid,
                'bans': agregateBans(game.teams),
                'winner': game.teams[0].winner,
                'firstBlood': game.teams[0].firstBlood,
                'firstTower': game.teams[0].firstTower,
                'firstInhibitor': game.teams[0].firstInhibitor,
                'firstBaron': game.teams[0].firstBaron,
                'firstDragon': game.teams[0].firstDragon,
                'league': decideLeague(game.participants)
            });
        }
    });
    json2csv({
        data: allGames,
        fields: [
            'id',
            'region',
            'gameType',
            'date',
            'firstBlood',
            'firstTower',
            'firstInhibitor',
            'firstBaron',
            'firstDragon',
            'league',
            'blue_adc',
            'blue_supp',
            'blue_jng',
            'blue_top',
            'blue_mid',
            'purple_adc',
            'purple_supp',
            'purple_jng',
            'purple_top',
            'purple_mid',
            'winner'
        ]
    }, function(err, csv) {
        if (err) console.log(err);
        fs.writeFile('csv/' + fileName + '.csv', csv, function(err) {
            if (err) throw err;
            console.log('csv saved');
        });
    });
}));





//mongoimport --collection collection --file collection.json
