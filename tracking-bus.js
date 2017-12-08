// 'use strict';

var socketIO = null;


let trackingBusA1 = {route: 'A1', routeCurrent: 3}
let trackingBusA2 = {route: 'A2', routeCurrent: 3}
var busBroadcastA1 = {};
var busBroadcastA2 = {};

// const emitRouteGPS = (routeName, routeNodes, currentIndex) => {

//   trackingBusA1 = Object.assign(trackingBusA1, { 
//     [routeName] : routeNodes[currentIndex]
//   });

//   socketIO.emit( 'trackingBusA1Send', trackingBusA1 );
// }

// function broadcastEvent() {

// }
function broadcastEvent(channel, data) {
    socketIO.emit(channel, data);
}
setTimeout(broadcastEvent, 10);


const runA1 = io => {
    socketIO = io;

    socketIO.on('connection', socket => {
        socket.emit('trackingBusA1Success', trackingBusA1);
        socket.on('trackingA1', busName => {
            console.log(busName);
            if(busName != null) {
                busBroadcastA1 = Object.assign(busBroadcastA1, { 
                    busName: busName.busName,
                    lat: busName.lat,
                    lng: busName.lng,
                    time: busName.time
                }); 
                // console.log(busName);
                // socket.emit('trackingBusA1Broadcast', busName);
                broadcastEvent('trackingBusA1Broadcast', busName);
            }     
            socket.emit('trackingBusA1Broadcast', busName);
        });
        if(busBroadcastA1 != null) {
            socket.emit('trackingBusA1Broadcast', busBroadcastA1);
        }
    });
}


const runA2 = io => {
    socketIO = io;

    socketIO.on('connection', socket => {
        socket.emit('trackingBusA2Success', trackingBusA2);
        socket.on('trackingA2', busName => {
            console.log(busName);
            if(busName != null) {
                busBroadcastA2 = Object.assign(busBroadcastA2, { 
                    busName: busName.busName,
                    lat: busName.lat,
                    lng: busName.lng,
                    time: busName.time
                }); 
                // console.log(busName);
                // socket.emit('trackingBusA1Broadcast', busName);
                broadcastEvent('trackingBusA2Broadcast', busName);
            }     
            socket.emit('trackingBusA2Broadcast', busName);
        });
        if(busBroadcastA2 != null) {
            socket.emit('trackingBusA2Broadcast', busBroadcastA2);
        }
    });
}

module.exports.runA1 = runA1;
module.exports.runA2 = runA2;
