'use strict';

module.exports = function(sio) {

    // Socket configuration
    sio.set('log level',1);
    sio.configure(function () {
        sio.set('transports', ['xhr-polling']);
        sio.set('polling duration', 10000000);
    });

    var connected_user = {};
    sio.sockets.on('connection', function (socket) {
        var user = null;
        var lastStatus = null;

        socket.on('identification', function (data) {
            user = data.mac_adress;
            lastStatus = data.status;

            console.log('New connection from :' + user);

            connected_user[user] = socket;
        });

        socket.on('status', function(status) {
            console.log('Status update :');
            console.log(status);

            console.log('Send watering message');
            socket.emit('watering', 5);
        });
    });
};