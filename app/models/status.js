'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Status Schema
 */
var StatusSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    tmp: {type: Number},
    hum: {type: Number},
    light: {type: Number},
    ground_hum: {type: Number},
    water_presence: {type: Boolean},
    plant: {
        type: Schema.ObjectId,
        ref: 'Plant'
    }
});

mongoose.model('Status', StatusSchema);
