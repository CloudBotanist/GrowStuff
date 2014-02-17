'use strict';

var mongoose = require('mongoose'),
    Plant = mongoose.model('Plant');

var connected_plant = [];

module.exports.isPlantConnected = function(plantId) {
    if (connected_plant.indexOf(plantId.toString()) >= 0)  {
        return true;
    } else {
        return false;
    }
};

var retrievePlantFromSocket = function(socket, cb) {
    socket.get('plantId', function(err, id) {
        if (err) {
            return cb(err);
        }

        Plant.findOne({_id: id}, cb);
    });
};

module.exports.init = function(sio) {

    // Socket configuration
    sio.set('log level',1);
    sio.configure(function () {
        sio.set('transports', ['xhr-polling']);
        sio.set('polling duration', 10000000);
    });

    sio.sockets.on('connection', function (socket) {

        socket.on('identification', function (data) {
            Plant.findOne({mac_adress: data.id}, function(err, plant) {
                if (!err && plant) {
                    console.log('New connection from :' + plant.name);

                    socket.set('plantId', plant.id);
                    connected_plant.push(plant.id);
                }
            });
        });

        socket.on('status', function(status) {
            retrievePlantFromSocket(socket, function(err, plant) {
                console.log('Status update from '+ plant.name +' :');
                console.log(status);
            });
        });

        socket.on('disconnect', function () {
            retrievePlantFromSocket(socket, function(err, plant) {
                console.log('Plant '+ plant.name + ' disconnected');
                connected_plant.splice(connected_plant.indexOf(plant.id), 1);
            });
        });
    });
};