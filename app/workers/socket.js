'use strict';

var mongoose = require('mongoose'),
    Plant = mongoose.model('Plant'),
    Status = mongoose.model('Status');

var connected_plant = {};

module.exports.isPlantConnected = function(plantId) {
    if (connected_plant[plantId.toString()])  {
        return true;
    } else {
        return false;
    }
};

module.exports.sendMessage = function(plantId, event, message) {
    var socket = connected_plant[plantId];

    console.log('Send the ' + event + ' event to the plant with id ' + plantId + ' -> ' + JSON.stringify(message));
    socket.emit (event, message);
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
            data = JSON.parse(data);
            Plant.findOne({_id: data.id}, function(err, plant) {
                if (err) {
                    console.log(err);
                }

                if (!err && plant) {
                    console.log('New connection from :' + plant.name);

                    socket.set('plantId', plant.id);
                    connected_plant[plant.id] = socket;
                }
            });
        });

        socket.on('status', function(data) {
            var status = JSON.parse(data);
            console.log(status.toString());

            retrievePlantFromSocket(socket, function(err, plant) {
                if (!plant) {
                    return console.log('The plant is not authenticated');
                }

                console.log('Status update from '+ plant.name);

                status.plant = plant.id;
                var plantStatus = new Status(status);
                plantStatus.save();
            });
        });

        socket.on('disconnect', function () {
            retrievePlantFromSocket(socket, function(err, plant) {
                if (err) {
                    return;
                }
                console.log('Plant '+ plant.name + ' disconnected');
                delete connected_plant[plant.id];
            });
        });
    });
};