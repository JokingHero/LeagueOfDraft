'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Players Base Schema
 */
var PlayersBaseSchema = new Schema({
    summoner: {
        type: String,
        trim: true,
        default: 'Unknown'
    },
    region: {
        type: String,
        trim: true,
        default: 'Unknown'
    },
    id: {
        type: String,
        trim: true,
        default: 'Unknown',
        unique: true,
        require: true
    },
    updated: {
        type: Date,
        default: Date.now(),
        require: true
    },
    champions: [{
        id: Number,
        winPercent: Number
    }]
});

PlayersBaseSchema.index({ summoner: 1, region: 1});
mongoose.model('PlayersBase', PlayersBaseSchema);
