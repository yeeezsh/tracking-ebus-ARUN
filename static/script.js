// import { start } from "repl";

var markers = {};
var map;
var socket = io();
var markerGeo;
var busA1Marker;
var busA2Marker;
var posBusA1;
var posBusA2;
var posGeo;
var path = 0;

const geoBase = [
    // {
    //     'name': 'อาคารวิศววัฒนะ - บ้านธรรมรักษา 1',
    //     'location': [[13.650008, 100.493684], [13.649302, 100.493813], [13.649135, 100.494628], [13.649891, 100.495508], [13.650576, 100.494945],[13.650753, 100.494194]],
    //     'a1': 1,
    //     'a2': 7,
    //     'center': [13.650053, 100.494271]
    // },
    // {
    //     'name': 'เดอะคิวบ์',
    //     'location': [[13.654853, 100.498868], [13.655356, 100.499127], [13.654949, 100.500184], [13.654070, 100.499811]],
    //     'a1': 3,
    //     'a2': 2,
    //     'center': [13.654853, 100.498868]
    // },
    // {
    //     'name': 'สำนักงานอธิการบดี',
    //     'location': [[13.651838, 100.495397], [13.652305, 100.495740], [13.651299, 100.495694], [13.651231, 100.494602]],
    //     'a1': 0,
    //     'a2': 0,
    //     'center': [13.652076, 100.495402]
    // },
    {
        'name': 'เดอะคิวบ์',
        'location': [[13.654806, 100.498623], [13.655452, 100.499159], [13.655082, 100.500387], [13.655082, 100.500387]],
        'a1': 3,
        'a2': 2,
        'center': [13.654853, 100.498868]
    },
    {
        'name': 'อาคารวิศววัฒนะ - บ้านธรรมรักษา 1',
        'location': [[13.650192, 100.495116], [13.649853, 100.494698], [13.649321, 100.494151]],
        'a1': 1,
        'a2': 7,
        'center': [13.650192, 100.495116]
    },
    {
        'name': 'สำนักงานอธิการบดี',
        'location': [[13.652076, 100.495402], [13.651838, 100.495397], [13.651539, 100.495388]],
        'a1': 0,
        'a2': 0,
        'center': [13.652076, 100.495402]
    },
    {
        'name': 'อาคารเรียนรวม 1',
        'location': [[13.651665, 100.492958], [13.651529, 100.492947], [13.651344, 100.492942], [13.651344, 100.492942]],
        'a1': 3,
        'center': [13.651665, 100.492958]
    },
    {
        'name': 'อาคารพระจอมเกล้าราชานุสรณ์ฯ',
        'location': [[13.651287, 100.492100], [13.651035, 100.492106], [13.650615, 100.492117]],
        'a2': 5,
        'center': [13.651035, 100.492106]
    },
    {
        'name': 'อาคารเรียนรวม 3',
        'location': [[13.650268, 100.492065], [13.650101, 100.492167], [13.649981, 100.492303]],
        'a1': 2,
        'a2': 6,
        'center': [13.650101, 100.492167]
    },
    {
        'name': 'สำนักหอสมุด',
        'location': [[13.652317, 100.493893], [13.652335, 100.494027], [13.652244, 100.493957]],
        'a2': 3,
        'center': [13.652317, 100.493893]
    },
    {
        'name': 'สถาบันวิทยาการหุ่นยนต์ฯ',
        'location': [[13.654032, 100.494387], [13.654048, 100.494567], [13.654025, 100.494822]],
        'a2': 2,
        'center': [13.654032, 100.494387]
    },
    {
        'name': 'อาคารเอนกประสงค์',
        'location': [[13.652188, 100.493295], [13.652094, 100.493147], [13.651789, 100.493024]],
        'a1': 4,
        'a2': 4,
        'center': [13.652188, 100.493295]
    },
    {
        'name': 'อาคารปฏิบัติการวิทยาศาสตร์ฯ',
        'location': [[13.653110, 100.494869], [13.653454, 100.494810], [13.653647, 100.494858]],
        'a1': 5,
        'a2': 1,
        'center': [13.653110, 100.494869]
    }

];

function initMap() {

    URL = window.location.href;
    socket = io.connect(URL);

    //map initial --> prioritize
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 18,
        center: {lat: 13.651011, lng: 100.493944}
    });

    socket.on("connect", function() {

        snackBar("You have connected to server.", 3500)
    });

    socket.on("disconnect", function() {
        snackBar("You have been disconnected from server.", 10000);
    });

    //mockup A1 A2
    socket.on("locationUpdated", function(locationState){
        for (var k in locationState) {
            newMarker(k, locationState[k]);
        }
    });
    socket.on("locationUpdatedR2", function(locationStateR2){
        for (var kR2 in locationStateR2) {
            newMarkerR2(kR2, locationStateR2[kR2]);
        }
    });




    //     //want to know distance from bus to you
    // //***********
    // let stopNodeA1 = compareCloseNode(posGeo, geoBase, 1);
    // let stopNodeA2 = compareCloseNode(posGeo, geoBase, 2);
    // estimateRoute(posBusA1.node, stopNodeA1, 1); //A1
    // estimateRoute(posBusA2.node, stopNodeA2, 2); //A2

    // busA1 marker
    socket.on("trackingBusA1Broadcast", function(data){
        console.log(data);
        posBusA1 = {
            lat: data.lat,
            lng: data.lng,
            node:data.nodeRoute
        };
        if (busA1Marker == null && posBusA1.lat != null) {
                busA1Marker = new google.maps.Marker({
                position: posBusA1,
                map: map,
                icon: {
                    url: '/static/truck.png',
                    size: new google.maps.Size(150, 150),
                    scaledSize: new google.maps.Size(50, 50),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(25, 25),
                    optimized: false
                }
            });
        } else if(posBusA1.lat != null) {
            busA1Marker.setPosition(posBusA1);
            console.log(getDistanceFromLatLon(posGeo, posBusA1));
            estimateRoute(posBusA1.node, compareCloseNode(posGeo, geoBase, 1), 1); //A1
        } else {
            console.log("A1 broadcast connect but not get position");
        }
    });

        // busA2 marker
        socket.on("trackingBusA2Broadcast", function(data){
            console.log(data);
            posBusA2 = {
                lat: data.lat,
                lng: data.lng,
                node:data.nodeRoute
            };
            if (busA2Marker == null && posBusA2.lat != null) {
                    busA2Marker = new google.maps.Marker({
                    position: posBusA2,
                    map: map,
                    icon: {
                        url: '/static/truck-R2.png',
                        size: new google.maps.Size(150, 150),
                        scaledSize: new google.maps.Size(50, 50),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(25, 25),
                        optimized: false
                    }
                });
            } else if(posBusA2.lat != null) {
                busA2Marker.setPosition(posBusA2);
                console.log(getDistanceFromLatLon(posGeo, posBusA2));
                // console.log(posBusA2.node);
            } else {
                console.log("A2 broadcast connect but not get position");
            }
        });

    // // busA2 marker
    // socket.on("trackingBusA2Broadcast", function(data){
    //     console.log(data);
    //     let posBusA2 = {
    //         lat: data.lat,
    //         lng: data.lng
    //     }
    //     if (busA2Marker == null && posBusA2.lat != null) {
    //             busA2Marker = new google.maps.Marker({
    //             position: posBusA2,
    //             map: map,
    //             icon: {
    //                 url: '/static/truck-R2.png',
    //                 size: new google.maps.Size(150, 150),
    //                 scaledSize: new google.maps.Size(50, 50),
    //                 origin: new google.maps.Point(0, 0),
    //                 anchor: new google.maps.Point(25, 25),
    //                 optimized: false
    //             }
    //         });
    //     } else if(posBusA2.lat != null) {
    //         busA2Marker.setPosition(posBusA2);
    //         console.log(getDistanceFromLatLon(posGeo, posBusA2));
    //         console.log('A2 > closet node -->' + compareCloseNode(posGeo, geoBase, 2));

    //     } else {
    //         console.log("A2 broadcast connect but not get position");
    //     }
    // });

    //geo function

    var options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };
    
    
    function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
    };

    navigator.geolocation.watchPosition(successGeo, error, options);
    ///end geo call



}; ///////////// finish init()

function snackBar(snackBarText, s) {
    var snackbar = document.getElementById("snackbar")
    // Add the "show" class to DIV
    snackbar.className = "show";
    snackbar.innerHTML = snackBarText;
    // After 3 seconds, remove the show class from DIV
    setTimeout(function() {
        snackbar.className = snackbar.className.replace("show", ""); 
    }, s);
};

function successGeo(pos) {
    var crd = pos.coords;
    posGeo = {
        lat: crd.latitude,
        lng: crd.longitude
    }
    console.log('Your current position is:');
    console.log('Latitude : ' + crd.latitude);
    console.log('Longitude: ' + crd.longitude);
    console.log('More or less ' + crd.accuracy + ' meters.');
    if (markerGeo == null) {
        markerGeo = new google.maps.Marker({
        position: posGeo,
        map: map,
            icon: {
                url: '/static/locator.png',
                size: new google.maps.Size(150, 150),
                scaledSize: new google.maps.Size(50, 50),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(25, 25),
                optimized: false
            }
        });
    } else {
        markerGeo.setPosition(posGeo);
    }
    //your location close to 
    console.log('A1 > you closet node -->' + compareCloseNode(posGeo, geoBase, 1));
    console.log('A2 > you closet node -->' + compareCloseNode(posGeo, geoBase, 2));


};

function getDistanceFromLatLon(pos1, pos2) {
    let lat1 = pos1.lat;
    let lon1 = pos1.lng;
    let lat2 = pos2.lat;
    let lon2 = pos2.lng;

    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    d = d * 1000 //convert to m
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  function compareCloseNode(geo, data, route){
    let min = 999999;
    let i = 0;
    for(k in data) {
        let center = {
            lat: data[k].center[0],
            lng: data[k].center[1]
        };
        if (getDistanceFromLatLon(geo, center) <= min) {
            min = getDistanceFromLatLon(geo, center);
            i = k;
        }
    }
    if(route == 1){
        return data[i].a1;
    }else if (route == 2) {
        return data[i].a2;
    }
}


//     function newMarkerBusA1(k, location) {
//     if (busA1Marker[k] == null) {
//         busA1Marker[k] = new google.maps.Marker({
//             position : location,
//             map: map,
//             icon: {
//                 url: '/static/test.png',
//                 size: new google.maps.Size(100, 100),
//                 scaledSize: new google.maps.Size(50, 50),
//                 origin: new google.maps.Point(0, 0),
//                 anchor: new google.maps.Point(25, 25),
//                 optimized: false
//             } 
//         });
//     } else {
//         busA1Marker[k].setPosition(location);
//     }    
// };



function newMarker(k, location) {
    if (markers[k] == null) {
        markers[k] = new google.maps.Marker({
            position : location,
            map: map,
            icon: {
                url: '/static/truck.png',
                size: new google.maps.Size(100, 100),
                scaledSize: new google.maps.Size(50, 50),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(25, 25),
                optimized: false
            } 
        });
    } else {
        markers[k].setPosition(location);
    }    
};

function newMarkerR2(k, location) {
    if (markers[k] == null) {
        markers[k] = new google.maps.Marker({
            position : location,
            map: map,
            icon: {
                url: '/static/truck-R2.png',
                size: new google.maps.Size(100, 100),
                scaledSize: new google.maps.Size(50, 50),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(25, 25),
                optimized: false
            } 
        });
    } else {
        markers[k].setPosition(location);
    } 
};

function topBoxMap() {
    socket.on("locationUpdatedR2", function(locationStateR2){
        for (var kR2 in locationStateR2) {
            document.getElementById("text-box-map").innerText = locationStateR2[kR2].lat + "+" + locationStateR2[kR2].lng
        }
    });
    
};

// console.log('A1 > you closet node -->' + compareCloseNode(posGeo, geoBase, 1));

function estimateRoute(startNode, stopNode, route) { //function will return total path in meters (m)

    // if (route == 1 ) { //stop node at 5
    //     for(i = startNode; i == stopNode; i++){
    //         for(k in geoBase) {
    //             if(geoBase[k].a1 == startNode){
    //                 console.log('kk -->'+ k);
    //                 console.log(geoBase[k].name)
    //                 let j = k+1
    //                 console.log("jjjj"+j)
    //                 path += getDistanceFromLatLon(geoBase[k].center, geoBase[j].center); 
    //             }
    //         }
    //         if(i == 5) i = 0;
    //     }
    //     console.log('path is -->'+ path + 'm');
    //     return path;
    // } else if (route == 2 && startNode != stopNode) { //stop node at 7

    // } else if (startNode == stopNode) {
    //     console.log('will be arrive in a minutes');
    // }
    if(route == 1 && startNode != stopNode){ //stop node at 5
        // console.log("hello");
        console.log("estimate route 1 working");
        console.log(startNode+"----"+stopNode+"----"+route);
        for(startNode; startNode == stopNode; startNode++) {
            console.log(startNode);
            let j = findNode(i,1);
            let k = findNode(j+1,1)
            path += getDistanceFromLatLon(geoBase[j].center, geoBase[k].center);
            console.log("path --->" + path);
        }
        // if(startNode > 5) i = 0;
    }
};

function findNode(index, route) {
    if(route == 1) {
        for(i in geoBase) {
            if(geoBase[i].a1 == index) return i;
        }
    } else {
        for(i in geoBase){
            if(geoBase[i].a2 == index) return i;
        }
    }

}


//bug some devices

// alert('Latitude : ' + crd.latitude + 'Longitude: ' + crd.longitude + 'More or less ' + crd.accuracy + ' meters.')

// function markerGeo(k, posGeo) {
//     if (markers[k] == null) {
//         markers[k] = new google.maps.Marker({
//             position : location,
//             map: map,
//             icon: {
//                 url: '/static/truck-R2.png',
//                 size: new google.maps.Size(100, 100),
//                 scaledSize: new google.maps.Size(50, 50),
//                 origin: new google.maps.Point(0, 0),
//                 anchor: new google.maps.Point(25, 25),
//                 optimized: false
//             } 
//         });
//     } else {
//         markers[k].setPosition(posGeo);
//     } 
// };

// var markerGeo = new google.maps.Marker({
//     position: posGeo,
//     map: map,
//         icon: {
//             url: '/static/locator.png',
//             size: new google.maps.Size(150, 150),
//             scaledSize: new google.maps.Size(50, 50),
//             origin: new google.maps.Point(0, 0),
//             anchor: new google.maps.Point(25, 25),
//             optimized: false
//         }
//     })

// function newGeoMarker(posGeo) {
//     if(markerGeo == null) {
//         var markerGeo = new google.maps.Marker({
//             position: posGeo,
//             map: map,
//             icon: {
//                 url: '/static/locator.png',
//                 size: new google.maps.Size(150, 150),
//                 scaledSize: new google.maps.Size(50, 50),
//                 origin: new google.maps.Point(0, 0),
//                 anchor: new google.maps.Point(25, 25),
//                 optimized: false
//             }    
//         })
//     } else {
//         markerGeo.setPosition(posGeo);
//     }
// };



