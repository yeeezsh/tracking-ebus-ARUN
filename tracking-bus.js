'use strict';

var geoBase = require('./geo-base.js')
var socketIO = null;

var busBroadcastA1 = {};
var busBroadcastA2 = {};

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
            if (busName != null) {

                let posBase = [busName.lat, busName.lng];

                if (geoBase.run(posBase) != 0) { //prevent from NaN data
                    geoBaseEventA1 = geoBase.run(posBase);
                } else if (geoBase.run(posBase) != null) {
                    geoBaseEventA1 = geoBaseEventA1;
                } else {
                    geoBaseEventA1 = Object.assign(geoBaseEventA1, {
                        'buildingName': 'not in range',
                        'nodeRouteA1': 99
                    });
                }
                console.log(geoBaseEventA1); //work better

                if (busName.speed == null) { //will get speed from position later
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
                    speed: busName.speed
                });

                broadcastEvent('trackingBusA1Broadcast', busBroadcastA1);

            }
            socket.emit('trackingBusA1Broadcast', busBroadcastA1);
        });
        if (busBroadcastA1 != null) {
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
            if (busName != null) {
                let posBase = [busName.lat, busName.lng];

                if (geoBase.run(posBase) != 0) { //prevent from NaN data
                    geoBaseEventA2 = geoBase.run(posBase);
                } else if (geoBase.run(posBase) != null) {
                    geoBaseEventA2 = geoBaseEventA2;
                } else {
                    geoBaseEventA2 = Object.assign(geoBaseEventA2, {
                        'buildingName': 'not in range',
                        'nodeRouteA1': 99
                    });
                }
                console.log(geoBaseEventA2); //work better

                if (busName.speed == null) { //will get speed from position later
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
                    speed: busName.speed
                });

                broadcastEvent('trackingBusA2Broadcast', busBroadcastA2);

            }
            socket.emit('trackingBusA2Broadcast', busBroadcastA2);
        });
        if (busBroadcastA2 != null) {
            socket.emit('trackingBusA2Broadcast', busBroadcastA2);
        }
    });
}

const busBroadcast = (io, data, channel = 'A1') => {
    let geoBaseEvent = {};
    let busName = data
    let busBroadcast = {}
    console.log(busName);
    if (busName != null) {

        let posBase = [busName.lat, busName.lng];

        if (geoBase.run(posBase) != 0) { //prevent from NaN data
            geoBaseEvent = geoBase.run(posBase);
        } else if (geoBase.run(posBase) != null) {
            geoBaseEvent = geoBaseEventA1;
        } else {
            geoBaseEvent = Object.assign(geoBaseEvent, {
                'buildingName': 'not in range',
                'nodeRouteA1': 99
            });
        }
        console.log(geoBaseEvent); //work better

        if (busName.speed == null) { //will get speed from position later
            busName.speed = 0.1;
        } else if (busName.speed == null && busBroadcast.speed != null) {
            busName.speed = busBroadcastA1.speed;
        }

        busBroadcast = Object.assign(busBroadcast, {
            busName: busName.busName,
            lat: busName.lat,
            lng: busName.lng,
            time: busName.time,
            building: geoBaseEvent.buildingName,
            nodeRoute: geoBaseEvent.nodeRouteA1,
            speed: busName.speed
        });

        // broadcastEvent('trackingBusBroadcast', busName, busBroadcast);
        io.emit('trackingBusA1Success', busBroadcast)

    }
    io.emit(`trackingBus${channel}Broadcast`, busBroadcast);
}

module.exports.runA1 = runA1;
module.exports.runA2 = runA2;
module.exports.busBroadcast = busBroadcast;
