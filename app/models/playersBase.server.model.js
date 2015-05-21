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
        required: true
    },
    region: {
        type: String,
        trim: true,
        required: true
    },
    id: {
        type: String,
        trim: true,
        unique: true,
        require: true
    },
    updated: {
        type: Date,
        default: Date.now()
    },
    champions: [{
        id: Number,
        winPercent: Number
    }]
});

PlayersBaseSchema.index({
    id: 1
});

mongoose.model('PlayersBase', PlayersBaseSchema);
