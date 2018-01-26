var markers = {};
var map;
var socket = io();
var markerGeo;
var busA1Marker;
var busA2Marker;
var posBusA1;
var posBusA2;
var posGeo;
var pathA1;
var pathA2;
var time = 0;
var countTime1 = 0;
var countTime2 = 0;
var sumTime1 = 0;
var sumTime2 = 0;
var pathConstA1;
var pathConstA2;
const a1CircleData = 6; //stop configuration
const a2CircleData = 8;
var uiTimerSelected = 0;
var t1, t2;

// var pathConstA1;
// var pathConstA2;

const geoBase = [
    {
        'name': 'อาคารวิศววัฒนะ - บ้านธรรมรักษา 1',
        'location': [[13.650008, 100.493684], [13.649302, 100.493813], [13.649135, 100.494628], [13.649891, 100.495508], [13.650576, 100.494945],[13.650753, 100.494194]],
        'a1': 1,
        'a2': 7,
        'center': [13.650053, 100.494271]
    },
    {
        'name': 'สำนักงานอธิการบดี',
        'location': [[13.651838, 100.495397], [13.652305, 100.495740], [13.651299, 100.495694], [13.651231, 100.494602]],
        'a1': 0,
        'a2': 0,
        'center': [13.652076, 100.495402]
    },
    {
        'name': 'อาคารเรียนรวม 1',
        'location': [[13.651447, 100.492676],[13.652256, 100.492565], [13.652167, 100.493498], [13.651411, 100.492999]],
        'a1': 3,
        'center': [13.651665, 100.492958]
    },    {
        'name': 'อาคารพระจอมเกล้าราชานุสรณ์ฯ',
        'location': [[13.650589, 100.491454], [13.651335, 100.491491], [13.651335, 100.492340], [13.650381, 100.492254]],
        'a2': 5,
        'center': [13.650897, 100.491970]
    },
    {
        'name': 'อาคารเรียนรวม 3',
        'location': [[13.650268, 100.492065], [13.650388, 100.491490], [13.650018, 100.491249], [13.649497, 100.492027], [13.650048, 100.492506], [13.650332, 100.492187]],
        'a1': 2,
        'a2': 6,
        'center': [13.649873, 100.491938]
    },
    {
        'name': 'สำนักหอสมุด',
        'location': [[13.652188, 100.493295], [13.652153, 100.494491], [13.652711, 100.494137], [13.653321, 100.493702], [13.652740, 100.493825], [13.652425, 100.493825], [13.652133, 100.493753]],
        'a2': 3,
        'center': [13.652451, 100.493949]
    },
    {
        'name': 'สถาบันวิทยาการหุ่นยนต์ฯ',
        'location': [[13.653573, 100.494094], [13.654459, 100.493843], [13.654912, 100.494989], [13.654326, 100.495674], [13.653717, 100.495191]],
        'a2': 2,
        'center': [13.654018, 100.494623]
    },
    {
        'name': 'อาคารเอนกประสงค์',
        'location':  [[100.49316,13.65204],[100.49349,13.65219],[100.49345,13.65256],[100.49302,13.65267],[100.49288,13.6522],[100.49316,13.65204]],
        'a1': 4,
        'a2': 4,
        'center': [13.652094, 100.493147]  
    },
    {
        'name': 'อาคารปฏิบัติการวิทยาศาสตร์ฯ',
        'location': [[100.49458,13.65352],[100.49477,13.65277],[100.49534,13.65298],[100.49545,13.65348],[100.49506,13.65374],[100.49458,13.65352]],
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
        zoom: 16,
        // center: {lat: 13.651011, lng: 100.493944}
        center: {lat:13.651529, lng:100.494347},
        disableDefaultUI: true
    });

    socket.on("connect", function() {

        snackBar("เชื่อมต่อกับเซิร์ฟเวอร์แล้ว", 3500)
    });

    socket.on("disconnect", function() {
        snackBar("ขาดการเชื่อมต่อกับเซิร์ฟเวอร์", -1);
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

    socket.on("trackingBusA1Broadcast", function(data){
        console.log(data);
        posBusA1 = {
            lat: data.lat,
            lng: data.lng,
            node:data.nodeRoute,
            building:data.building,
            speed: data.speed
        };

        document.getElementById('a1-bus-geofence').innerText = posBusA1.building;

        if (busA1Marker == null && posBusA1.lat != null) {
                busA1Marker = new google.maps.Marker({
                position: posBusA1,
                map: map,
                icon: {
                    url: '/static/truck.png',
                    size: new google.maps.Size(100, 100),
                    scaledSize: new google.maps.Size(65, 65),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(25, 25),
                    optimized: false
                }
            });
        } else if(posBusA1.lat != null) {
            busA1Marker.setPosition(posBusA1);
            console.log("a1 far from you" + getDistanceFromLatLon(posGeo, posBusA1));
            estimateRoute(posBusA1.node, compareCloseNode(posGeo, geoBase, 1), 1); //A1
        } else {
            console.log("A1 broadcast connect but not get position");
        }

        if (posGeo != null && posBusA1 != null && pathConstA1 == null){
            pathConstA1 = getDistanceFromLatLon(posGeo, posBusA1); //set first const path for get %
        } 

    });

        // busA2 marker
        socket.on("trackingBusA2Broadcast", function(data){
            console.log(data);
            posBusA2 = {
                lat: data.lat,
                lng: data.lng,
                node:data.nodeRoute,
                building:data.building,
                speed: data.speed
            };

            document.getElementById('a2-bus-geofence').innerText = posBusA2.building;

            if (busA2Marker == null && posBusA2.lat != null) {
                    busA2Marker = new google.maps.Marker({
                    position: posBusA2,
                    map: map,
                    icon: {
                        url: '/static/truck-R2.png',
                        size: new google.maps.Size(100, 100),
                        scaledSize: new google.maps.Size(65, 65),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(25, 25),
                        optimized: false
                    }
                });
                const pathConstA2 = getDistanceFromLatLon(posGeo, posBusA2); //set first const path for get %
            } else if(posBusA2.lat != null) {
                busA2Marker.setPosition(posBusA2);
                console.log("a2 far from you" + getDistanceFromLatLon(posGeo, posBusA2));
                estimateRoute(posBusA2.node, compareCloseNode(posGeo, geoBase, 2),2); //A1
                // console.log(posBusA2.node);
            } else {
                console.log("A2 broadcast connect but not get position");
            }

            if (posGeo != null && posBusA2 != null && pathConstA2 == null){
                pathConstA2 = getDistanceFromLatLon(posGeo, posBusA2); //set first const path for get %
            } 

        });

    var options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };
    
    
    function error(err) { //gps error
        console.warn('ERROR(' + err.code + '): ' + err.message);
    };

    navigator.geolocation.watchPosition(successGeo, error, options);
    ///end geo call

}; ///////////// finish init()

function snackBar(snackBarText, s) {
    let snackbar = document.getElementById("snackbar")
    // Add the "show" class to DIV
    snackbar.className = "show";
    snackbar.innerHTML = snackBarText;
    // After 3 seconds, remove the show class from DIV
    if(s > -1) { //still show on screen
        setTimeout(function() {
            snackbar.className = snackbar.className.replace("show", ""); 
        }, s);
    }
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
                size: new google.maps.Size(100, 100),
                scaledSize: new google.maps.Size(45, 45),
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
    
    // showA1(); //show estimate time A1 / A2


};

function getDistanceFromLatLon(pos1, pos2) {
    let lat1 = pos1.lat;
    let lon1 = pos1.lng;
    let lat2 = pos2.lat;
    let lon2 = pos2.lng;

    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2-lat1);  // deg2rad below
    let dLon = deg2rad(lon2-lon1); 
    let a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    let d = R * c; // Distance in km
    d = d * 1000 //convert to m
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  function compareCloseNode(geo, data, route){
    let min = 99;
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

function newMarker(k, location) {
    if (markers[k] == null) {
        markers[k] = new google.maps.Marker({
            position : location,
            map: map,
            icon: {
                url: '/static/truck.png',
                size: new google.maps.Size(100, 100),
                scaledSize: new google.maps.Size(75, 75),
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
                scaledSize: new google.maps.Size(75, 75),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(25, 25),
                optimized: false
            } 
        });
    } else {
        markers[k].setPosition(location);
    } 
};

function estimateRoute(startNode, stopNode, route) { //function will return total path in meters (m)
    pathA1=0;
    pathA2=0;
    if(route == 1 && startNode != stopNode){ //stop node at 5
        // console.log(getDistanceFromLatLon(geoBase[startNode].center,geoBase[nextNode]));
        // console.log("hello");
        sumTime = 0;
        countTime1 = 0;
        countTime2 = 0;
        pathA1 = 0.0;
        console.log("estimate route 1 working");
        console.log(startNode+"----"+stopNode+"----"+route);
        while(startNode != stopNode) {
            let nextNode = (startNode + 1) % a1CircleData; //magic number 1
            // if(startNode > 5) startNode = 0
            console.log('startNode -->'+startNode);
            let startNodeA = findNode(startNode, 1);
            let nextNodeA = findNode(nextNode, 1);
            // console.log(typeof geoBase[startNodeA].center[0]);
            let geoStart = {
                lat:posBusA1.lat,
                lng:posBusA1.lng
            };
            let geoStop = {
                lat: geoBase[nextNodeA].center[0],
                lng:geoBase[nextNodeA].center[1]
            };
            pathA1 += getDistanceFromLatLon(geoStart,geoStop);
            startNode = nextNode;
            console.log("A1 path --->" + pathA1);
            
        }
    } else if (route == 2 && startNode != stopNode) {
        sumTime = 0;
        countTime1 = 0;
        countTime2 = 0;
        pathA2 = 0;
        console.log("estimate route 2 working");
        console.log(startNode+"----"+stopNode+"----"+route);
        while(startNode != stopNode) {
            let nextNode = (startNode + 1) % a2CircleData; //magic number 2
            // if(startNode > 5) startNode = 0
            console.log('startNode -->'+startNode);
            let startNodeA = findNode(startNode, 2);
            let nextNodeA = findNode(nextNode, 2);
            // console.log(typeof geoBase[startNodeA].center[0]);
            let geoStart = {
                lat:posBusA2.lat,
                lng:posBusA2.lng
            };
            let geoStop = {
                lat: geoBase[nextNodeA].center[0],
                lng:geoBase[nextNodeA].center[1]
            };
            pathA2 += getDistanceFromLatLon(geoStart,geoStop);
            startNode = nextNode;

            console.log("A2 path --->" + pathA2 + 'm');
            
        }
    } else if (startNode == stopNode && route == 1) {
        pathA1=getDistanceFromLatLon(posGeo, posBusA1);
        console.log(getDistanceFromLatLon(posGeo, posBusA1));
    } else if(startNode == startNode && route == 2){
        pathA2=getDistanceFromLatLon(posGeo, posBusA2);
        console.log(getDistanceFromLatLon(posGeo, posBusA2));
    }
    let Sumpath=pathA1+pathA2;
    if(posBusA1.speed != null && posBusA1.speed != 0){
        t1 = pathA1 / posBusA1.speed;
        console.log('pathA1 -->' + pathA1 + 'm');
        console.log('Speed A1  '+ posBusA1.speed);
        //console.log('estimate time -->'+estimateTime(sumTime1, countTime1, t));
        console.log('est time = '+ t1 + 's');
        /*sumTime1 += t;
        countTime1++;*/


        if(uiTimerSelected == 1){ //ui refesh
            document.getElementById('time-progress-text-left').innerText = t1 + " วินาที";
        }

    } if(posBusA2.speed != null && posBusA2.speed != 0){
        t2 = pathA2 / posBusA2.speed;
        console.log('pathA2 -->' + pathA2);
        console.log('Speed A2  '+ posBusA2.speed);
        //console.log('estimate time -->'+estimateTime(sumTime2, countTime2, t));
        console.log('est time = '+ t2 + 's');
        /*sumTime2 += t;
        countTime2++;*/

        if(uiTimerSelected == 2){//
            document.getElementById('time-progress-text-left').innerText = t2 + " วินาที";
        }
        
    }
};

function estimateTime(sum, n, newTime){ // not use now // for gradian time make it natural estimate
    n++;
    return (sum + newTime) / n
}

function findNode(index, route) { //translate node to array index
    if(route == 1) {
        for(i in geoBase) {
            if(geoBase[i].a1 == index) return i;
        }
    } else {
        for(i in geoBase){
            if(geoBase[i].a2 == index) return i;
        }
    }

};