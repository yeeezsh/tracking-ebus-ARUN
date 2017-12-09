var markers = {};
var map;
var socket = io();
var markerGeo;
var busA1Marker;
var busA2Marker;
var posBusA1;
var posBusA2;
var posGeo;

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
        posBusA1 = {
            lat: data.lat,
            lng: data.lng
        }
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
            console.log(getDistanceFromLatLonInKm(posGeo, posBusA1));
        } else {
            console.log("A1 broadcast connect but not get position");
        }
    });

    // busA2 marker
    socket.on("trackingBusA2Broadcast", function(data){
        console.log(data);
        let posBusA2 = {
            lat: data.lat,
            lng: data.lng
        }
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
            busA1Marker.setPosition(posBusA2);
            console.log(getDistanceFromLatLonInKm(posGeo, posBusA2));
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


};


function getDistanceFromLatLonInKm(pos1, pos2) {
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
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
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



