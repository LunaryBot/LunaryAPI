const io = require('socket.io-client');

const socket = io.connect('http://localhost:1');

socket.emit('message', 'Hello World');