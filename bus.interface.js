const axios = require('axios')
const target = 'https://www.aismagellan.io/api/things/pull/4bddf720-fc72-11e9-96dd-9fb5d8a71344'

function parse(parse, override) {
    return {
        busName: override.busName,
        lat: parse.Location[0],
        lng: parse.Location[1],
        speed: parse['Speed MPH'],
        time: new Date(),
    }
}

async function busRequest(override) {
    const { data } = await axios.default.get(target)
    const parsed = parse(data, override)
    return parsed
}

module.exports = (override, cb) => {
    return setInterval(async () => {
        const data = await busRequest(override)
        return cb(data)
    }, 500)
}