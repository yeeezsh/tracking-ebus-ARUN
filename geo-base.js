const inside = require('point-in-polygon');

// const polygon = [[13.661485, 100.505113], [13.662238, 100.505735], [13.661506, 100.506210]];

const data = [
        {   'name': 'cosmo building',
            'location': [[13.661599, 100.505082], [13.662501, 100.505951], [13.661015, 100.505994]]
        },
        {
            'name': 'the cube',
            'location': [[13.654853, 100.498868], [13.655312, 100.499834], [13.654499, 100.499727]]
        }
    ]


function readData(geo, data){
    console.log(data.location);
    for(k in data) {
        // console.log(data[k].name ,inside(geo, data[k].location));
        if(inside(geo, data[k].location) != false) {
            console.log('bus at --> ' + data[k].name);
            return data[k].name;
        }
    }
}

// console.log(inside([13.661868, 100.505719], polygon));
// console.log(inside([13.659761, 100.504119], polygon));

// const geodata = [13.655259, 100.497331];
// readData(geodata,data);

const run = geoImport => {
    let buildingName = readData(geoImport, data);
    return buildingName;
}

module.exports.run = run;