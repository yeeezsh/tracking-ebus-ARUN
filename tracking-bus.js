let trackingBusA1 = {   lat: 1,
                        lng: 0 };
let trackingBusA2 = {};
let socketIO = null;

const trackingListen = io => {
    socketIO = io;
    socketIO.emit('trackingBusA1Listen', trackingBusA1);
    // socketIO.on('trackingBusA1Listen', socket => {
        socketIO.emit('trackingBusA1Listen', {content: 'You have connected.'});
    // });
}

module.exports.trackingListen = trackingListen;