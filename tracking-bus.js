// 'use strict';

var socketIO = null;


let trackingBusA1 = {route: 'A1', routeCurrent: 3}
let trackingBusA2 = {route: 'A2', routeCurrent: 3}
var busBroadcast = {};


// const emitRouteGPS = (routeName, routeNodes, currentIndex) => {

//   trackingBusA1 = Object.assign(trackingBusA1, { 
//     [routeName] : routeNodes[currentIndex]
//   });

//   socketIO.emit( 'trackingBusA1Send', trackingBusA1 );
// }

const runA1 = io => {
    socketIO = io;
    var busBroadcast = {};
    socketIO.on('connection', socket => {
        socket.emit('trackingBusA1Succes', trackingBusA1);
        socket.on('trackingA1', busName => {
            console.log(busName);
            if(busName != null) {
                busBroadcast = Object.assign(busBroadcast, { 
                    busName: busName.busName,
                    lat: busName.lat,
                    lng: busName.lng,
                    time: busName.time
                }); 
                // console.log(busName);
                socket.emit('trackingBusA1Broadcast', busName);
            }     
            socket.emit('trackingBusA1Broadcast', busName);
        });
        if(busBroadcast != null) {
            socket.emit('trackingBusA1Broadcast', busBroadcast);
        }
    });
}
const runA2 = io => {
    socketIO = io;
    var busBroadcast = {};
    socketIO.on('connection', socket => {
        socket.emit('trackingBusA2Succes', trackingBusA2);
        socket.on('trackingA2', busName => {
            console.log(busName);
            if(busName != null) {
                busBroadcast = Object.assign(busBroadcast, { 
                    busName: busName.busName,
                    lat: busName.lat,
                    lng: busName.lng,
                    time: busName.time
                }); 
            }     
            socket.emit('trackingBusA2Broadcast', busName);
        });
        if(busBroadcast != null) {
            socket.emit('trackingBusA2Broadcast', busBroadcast);
        }
    });
}

module.exports.runA1 = runA1;
module.exports.runA2 = runA2;
