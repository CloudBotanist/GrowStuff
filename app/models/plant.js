'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Plant Schema
 */
var PlantSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        unique: true,
        trim: true
    },
    type: {
        type: String,
        trim: true
    },
    mode: {
        type: String,
        trim: true
    },
    mac_adress: {
        type: String
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/**
 * Validations
 */
PlantSchema.path('name').validate(function(name) {
    return name.length;
}, 'Le nom ne peut être vide');

PlantSchema.path('type').validate(function(type) {
    return type.length;
}, 'Le type ne peut être vide');

PlantSchema.path('mode').validate(function(mode) {
    return (mode === 'auto' || mode === 'manuel');
}, 'Mode doit être soit "Manuel" soit "Auto"');

/**
 * Statics
 */
PlantSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'username').exec(cb);
};

mongoose.model('Plant', PlantSchema);
