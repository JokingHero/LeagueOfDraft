'use strict';

var //config = require('../../config/config'),
    _ = require('lodash'),
    fs = require('fs'),
    rest = require('restler'),
    champions = require('../services/champions.json');

var allParsed = [];

module.exports = function() {
    rest.get('http://champion.gg/statistics/').on('complete', function(championsStats) {
        console.log('Worker statistics');
        if (championsStats instanceof Error) {
            console.log('[Worker] Error: %j', championsStats);
        } else {
            var keyString = "matchupData.stats = ";
            var start = championsStats.indexOf(keyString);
            if (start !== -1) {
                var championsStatsPartial = championsStats.substring(start + keyString.length);
                var championsUnparsed = JSON.parse(championsStatsPartial.slice(0, championsStatsPartial.indexOf("]") + 1));
                championsUnparsed.forEach(function(champ, index) {
                    var thisChamp = champions[champ.key];
                    var updateChamp = {
                        "id": thisChamp.id,
                        "name": thisChamp.name,
                        "key": champ.key,
                        "img": thisChamp.img,
                        "role": champ.role,
                        "winPercent": champ.general.winPercent,
                        "playPercent": champ.general.playPercent,
                        "banRate": champ.general.banRate,
                        "graphicsCount": thisChamp.graphicsCount,
                        "pros": thisChamp.pros,
                        "cons": thisChamp.cons,
                        "counters": []
                    };
                    var url = 'http://champion.gg/champion/' + champ.key + '/' + champ.role;
                    rest.get(url).on('complete', function(details) {
                        if (details instanceof Error) {
                            console.log('[Worker] Error: %j', details);
                        } else {
                            keyString = "matchupData.championData = ";
                            start = details.indexOf(keyString);
                            if (start !== -1) {
                                var stringRest = details.substring(start + keyString.length);
                                var championDetails = JSON.parse(stringRest.slice(0, stringRest.indexOf("};") + 1));
                                championDetails.matchups.forEach(function(matchup) {
                                    if (matchup.games > 10) {
                                        updateChamp.counters.push({
                                            "id": champions[matchup.key].id,
                                            "winRate": matchup.winRate
                                        });
                                    }
                                });
                                allParsed.push(updateChamp);
                                if (allParsed.length === championsUnparsed.length) {
                                    fs.writeFile('./app/services/currentChampsBase.json', JSON.stringify(allParsed, null, 4), function(err) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log("JSON saved");
                                        }
                                    });
                                }
                            }
                        }
                    });
                });

                console.log('[Worker] Fetch successfull.');

            } else {
                console.log('[Worker] Could not fetch from Champion.gg');
            }
        }
    });
};
