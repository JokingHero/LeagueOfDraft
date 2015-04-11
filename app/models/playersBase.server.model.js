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
    league: {
        type: String,
        trim: true,
        default: 'Unknown'
    },
    updated: {
        type: Date,
        default: Date.now(),
        require: true
    }
});

mongoose.model('PlayersBase', PlayersBaseSchema);
