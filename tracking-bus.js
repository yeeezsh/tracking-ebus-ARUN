let trackingBusR1 = {};
let trackingBusR2 = {};


const trackingListen = io => {
    io.on('trackingBusR1Listen', socket => {
        socket.emit('trackingBusR1Listen', {content: 'You have connected.'});
    });
}

module.exports.trackingListen = trackingListen;