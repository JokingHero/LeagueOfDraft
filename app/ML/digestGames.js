var fs = require('fs');
var JSONStream = require('JSONStream');
var es = require('event-stream');
var async = require('async');
var _ = require('lodash');

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

    var filteredValues = values.filter(function(n){ return n != undefined });

    filteredValues.sort(function(a, b) {
        return a - b;
    });
    console.log(values);
    console.log(filteredValues);
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
    var blue = [],
        purple = [];

    participants.forEach(function(participant) {
        if (participant.teamId === 100) {
            blue.push({
                'championId': participant.championId,
                'lane': participant.timeline.top,
                'role': participant.timeline.role
            });
        }
        if (participant.teamId === 200) {
            purple.push({
                'championId': participant.championId,
                'lane': participant.timeline.top,
                'role': participant.timeline.role
            });
        }
    });

    return {
        'blue': blue,
        'purple': purple
    }
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
    teams[0].bans.forEach(function(ban) {
        bans.push(ban.championId);
    });
    teams[1].bans.forEach(function(ban) {
        bans.push(ban.championId);
    });
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
getStream('matches1.json').pipe(es.mapSync(function(data) {
    data.forEach(function(game) {
        if (shouldParse) {
            allGames.push({
                'id': game.matchId,
                'region': game.region,
                'gameType': decideGameType(game.queueType),
                'date': game.matchCreation,
                'participants': agregatePlayersChampions(game.participants),
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
        agregatePlayersNames(allPlayers, game.participantIdentities);
    });
    fs.writeFile('parsedGames', JSON.stringify(allGames), function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("The file parsedGames was saved!");
        }
    });
    fs.writeFile('parsedPlayers', JSON.stringify(allPlayers), function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("The file parsedPlayers was saved!");
        }
    });
}));





//mongoimport --collection collection --file collection.json
