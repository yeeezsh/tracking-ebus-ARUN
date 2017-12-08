var markers = {};
var map;
var socket = io();
var markerGeo;
var busA1Marker;
var busA2Marker

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


    // busA1 marker
    socket.on("trackingBusA1Broadcast", function(data){
        console.log(data);
        let posGeoBus = {
            lat: data.lat,
            lng: data.lng
        }
        if (busA1Marker == null && posGeoBus.lat != null) {
                busA1Marker = new google.maps.Marker({
                position: posGeoBus,
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
        } else if(posGeoBus.lat != null) {
            busA1Marker.setPosition(posGeoBus);
        } else {
            console.log("A1 broadcast connect but not get position");
        }
    });

    // busA2 marker
    socket.on("trackingBusA2Broadcast", function(data){
        console.log(data);
        let posGeoBus = {
            lat: data.lat,
            lng: data.lng
        }
        if (busA2Marker == null && posGeoBus.lat != null) {
                busA2Marker = new google.maps.Marker({
                position: posGeoBus,
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
        } else if(posGeoBus.lat != null) {
            busA1Marker.setPosition(posGeoBus);
        } else {
            console.log("A1 broadcast connect but not get position");
        }
    });

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
    var posGeo = {
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
};



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



