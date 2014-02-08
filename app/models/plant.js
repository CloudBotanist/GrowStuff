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
PlantSchema.path('name').validate(function(title) {
    return title.length;
}, 'Name cannot be blank');

/**
 * Statics
 */
PlantSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'username').exec(cb);
};

mongoose.model('Plant', PlantSchema);
