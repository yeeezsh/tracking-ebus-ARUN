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

    socketIO.on('connection', socket => {
        socket.emit('trackingBusA1Succes', trackingBusA1);
        socket.on('trackingA1', busName => {
            console.log(busName);
        })
    });
}

module.exports.run = run;
