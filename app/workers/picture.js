'use strict';
var schedule = require('node-schedule');

var socket = require('./socket');
var mongoose = require('mongoose'),
    Plant = mongoose.model('Plant');

var sendPictureMessage = function() {
    Plant.find({}, function(err, res) {
        if (err) {
            console.log(err);
            return;
        }
        res.forEach(function(plant) {
            if (socket.isPlantConnected(plant.id)) {
                socket.sendMessage(plant.id, 'picture', {});
            }
        });
    });
};

/**
 * Schedule a picture mid-day every day a 12:00
 */
module.exports.init = function() {
    var rule = new schedule.RecurrenceRule();
    rule.hour = 12;

    console.log('Scheduler picture booted');

    schedule.scheduleJob(rule, function(){
        sendPictureMessage();
    });
};