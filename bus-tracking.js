'use strict';

let trackingBusR1 = {};
let trackingBusR2 = {};


const trackingBusR1Event = io => {
    io.on('trackingBusR1Listen', (trackingBusR1) => {
        io.emit('you connect');
    });
}

// const emitRouteR1 = (busName, busNode, current) => {
//     if(current == busNode.lenght) {
//         return setTimeout( () => {
//             emitRouteR1(busName, busNode, 0);
//         }, 3000);
//     }

//     trackingBusR1 = Object.assign(trackingBusR1, {
//         [busName] : busNode[current]
//     });

//     socketIO.emit('busTrackingR1Broadcast', trackingBusR1);

//     return setTimeout(() => {
//         emitRouteR1(busName, busNode, ++current);
//     }, 1000)
// }

// const runR1Broadcast = io => {
//     socketIO = io;

//     io.on('busTrackingR1Listen', socket => {
//         trackingBusR1 = Object.assign(trackingBusR1, {
//             [busName] : {la}
//         })
//     });
// }


  
  module.exports.trackingBusR1Event = trackingBusR1Event;