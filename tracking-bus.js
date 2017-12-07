// 'use strict';

var socketIO = null;


let trackingBusA1 = {route: 'A1', routeCurrent: 3}
let trackingBusA2 = {}


const emitRouteGPS = (routeName, routeNodes, currentIndex) => {

  trackingBusA1 = Object.assign(trackingBusA1, { 
    [routeName] : routeNodes[currentIndex]
  });

  socketIO.emit( 'trackingBusA1Send', trackingBusA1 );
}

const run = io => {
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
                    lng: busName.lng
                }); 
            }     
            socket.emit('trackingBusA1Broadcast', busName);
        });
        if(busBroadcast != null) {
            socket.emit('trackingBusA1Broadcast', busBroadcast);
        }
    });
}

module.exports.run = run;
