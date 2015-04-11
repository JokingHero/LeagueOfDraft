'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Games Base Schema
 */
var TeamCompBaseSchema = new Schema({
    champ1: {
        type: Number,
        default: 0
    },
    champ2: {
        type: Number,
        default: 0
    },
    champ3: {
        type: Number,
        default: 0
    },
    champ4: {
        type: Number,
        default: 0
    },
    champ5: {
        type: Number,
        default: 0
    },
    stats: [{
        day: Number,
        wins: Number,
        games: Number
    }]
});

mongoose.model('TeamCompBase', TeamCompBaseSchema);
