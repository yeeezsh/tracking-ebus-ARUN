'use strict';

const express = require('express');
const http = require('http'); //may be use later
const multer = require('multer');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const https = require('https');
const fs = require('fs');
const mockup = require('./mockup-tracking');
const trackingListenMain = require('./tracking-bus.js');

const options = {
    key: fs.readFileSync('./certificate/server.key'),
    cert: fs.readFileSync('./certificate/server.crt'),
    requestCert: false,
    rejectUnauthorized: false
};

// Get config for node environment
// Check `nodemon.json` for details
const ENV = process.env;

const CONFIG = {
	PORT: ENV.PORT
}

const app = express();

// Create socketIO and wrap app server inside
// const server = http.Server(app);
const server = https.createServer(options, app);
const io = socketIO(server);


// Add middleware to handle post request for express
const form = multer();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/static', express.static('static'));

// Serve index.html for path '/', this is home path
app.get('/', (req, res) => {
	res.sendFile('index.html', { root: __dirname });
});
app.get('/bus-tracking/a1', (req, res) => {
    res.sendFile('a1.html', { root: __dirname + '/bus-tracking/' });
})


server.listen(CONFIG.PORT, () => {
	console.log('Server is running at port: ' + CONFIG.PORT);
});

// Run fake tracking location
mockup.run(io);
mockup.runR2(io);

io.on('connection', socket => {
	socket.emit('connectSuccess', {content: 'You have connected.'});
});

trackingListenMain.trackingListen(io);

