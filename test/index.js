const io = require('socket.io-client');

const socket = io.connect('http://localhost:1');

socket.onAny((eventName, { nonce, data }) => {
    console.dir({
        op: eventName,
        nonce,
        data
    }, { breakLength: 2 });
})

socket.emit('ping', { nonce: '12345' });

module.exports = socket;