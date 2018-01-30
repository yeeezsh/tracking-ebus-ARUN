'use strict';

var geoBase = require('./geo-base.js')
var socketIO = null;

// geoBase.run([13.655259, 100.497331]) //sample how to  use this funciton


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
setTimeout(broadcastEvent, 100);

var geoBaseEventA1 = {};
var geoBaseEventA2 = {};

const runA1 = io => {
    socketIO = io;

    socketIO.on('connection', socket => {
        socket.emit('trackingBusA1Success', busBroadcastA1);
        socket.on('trackingA1', busName => {

            console.log(busName);
            if(busName != null) {
                // let posBase = [];
                let posBase = [busName.lat, busName.lng];
                // console.log(posBase);
                if(geoBase.run(posBase) != 0){ //prevent from NaN data
                    geoBaseEventA1 = geoBase.run(posBase);
                }else if (geoBase.run(posBase) != null){
                    geoBaseEventA1 = geoBaseEventA1;
                }else{
                    geoBaseEventA1 = Object.assign(geoBaseEventA1, {
                        'buildingName': 'not in range',
                        'nodeRouteA1': 99
                    });
                }
                console.log(geoBaseEventA1); //work better

                if(busName.speed == null) { //will get speed from position later
                    busName.speed = 0.1;
                } else if (busName.speed == null && busBroadcastA1.speed != null) {
                    busName.speed = busBroadcastA1.speed;
                }

                busBroadcastA1 = Object.assign(busBroadcastA1, { 
                    busName: busName.busName,
                    lat: busName.lat,
                    lng: busName.lng,
                    time: busName.time,
                    building: geoBaseEventA1.buildingName,
                    nodeRoute: geoBaseEventA1.nodeRouteA1,
                    speed:busName.speed
                });
                
                
                // console.log(busName);
                // socket.emit('trackingBusA1Broadcast', busName);
                broadcastEvent('trackingBusA1Broadcast', busBroadcastA1);
                // console.log(busBroadcastA1);

                //checking geo-base name
                
                // geoBase.run([busName.lat+','+busName.lng]); //work
                
            }     
            socket.emit('trackingBusA1Broadcast', busBroadcastA1);
        });
        if(busBroadcastA1 != null) {
            socket.emit('trackingBusA1Broadcast', busBroadcastA1);
        }
    });
}


const runA2 = io => {
    socketIO = io;

    socketIO.on('connection', socket => {
        socket.emit('trackingBusA2Success', busBroadcastA2);
        socket.on('trackingA2', busName => {

            console.log(busName);

            if(busName != null) {
                let posBase = [busName.lat, busName.lng];
                // console.log(posBase);
                if(geoBase.run(posBase) != 0){ //prevent from NaN data
                    geoBaseEventA2 = geoBase.run(posBase);
                }else if(geoBase.run(posBase) != null){
                    geoBaseEventA2 = geoBaseEventA2;
                }else{
                    geoBaseEventA2 = Object.assign(geoBaseEventA2, {
                        'buildingName': 'not in range',
                        'nodeRouteA2': 99
                    });
                }
                console.log(geoBaseEventA2); //work better

                if(busName.speed == null) { //will get speed from position later
                    busName.speed = 0.1;
                } else if (busName.speed == null && busBroadcastA2.speed != null) {
                    busName.speed = busBroadcastA2.speed;
                }


                busBroadcastA2 = Object.assign(busBroadcastA2, { 
                    busName: busName.busName,
                    lat: busName.lat,
                    lng: busName.lng,
                    time: busName.time,
                    building: geoBaseEventA2.buildingName,
                    nodeRoute: geoBaseEventA2.nodeRouteA2,
                    speed:busName.speed
                }); 
                // console.log(busName);
                // socket.emit('trackingBusA2Broadcast', busName);
                broadcastEvent('trackingBusA2Broadcast', busBroadcastA2);

                //checking geo-base name
                
                // geoBase.run([busName.lat+','+busName.lng]); //work
                
            }     
            socket.emit('trackingBusA2Broadcast', busBroadcastA2);
        });
        if(busBroadcastA2 != null) {
            socket.emit('trackingBus21Broadcast', busBroadcastA2);
        }
    });
}

module.exports.runA1 = runA1;
module.exports.runA2 = runA2;
