const axios = require('axios')
const target = 'https://www.aismagellan.io/api/things/pull/4bddf720-fc72-11e9-96dd-9fb5d8a71344'

function parse () {
    return ''
}

async function busRequest () {
const {data} = axios.default.get(target)
console.log(data)
return data
}
module.exports = () => {
const api = setInterval(() => busRequest, 500)

}