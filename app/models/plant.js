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
}, 'Please fill in a name');

PlantSchema.path('type').validate(function(type) {
    return type.length;
}, 'Please fill in type');

PlantSchema.path('mode').validate(function(mode) {
    return (mode === 'auto' || mode === 'manual');
}, 'The mode must be "Manual" or "Auto"');

/**
 * Statics
 */
PlantSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'username').exec(cb);
};

mongoose.model('Plant', PlantSchema);
