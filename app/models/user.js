'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * User Schema
 */
var UserSchema = new Schema({
    name: String,
    email: String,
    username: {
        type: String,
        unique: true
    },
    token: String,
    token_secret: String,
    twitter: {}
});

/**
 * Pre-save hook
 */
var validatePresenceOf = function(value) {
    return value && value.length;
};

UserSchema.pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.token) || !validatePresenceOf(this.token_secret))
        next(new Error('Invalid credentials'));
    else
        next();
});


mongoose.model('User', UserSchema);