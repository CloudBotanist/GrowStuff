'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Mention Schema
 */
var MentionSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    text: {
        type: String,
        trim: true
    },
    plant: {
        type: Schema.ObjectId,
        ref: 'Plant'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    status: {
        type: String
    },
    sender: {}
});

mongoose.model('Mention', MentionSchema);
