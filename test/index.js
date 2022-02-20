const io = require('socket.io-client');
require('dotenv').config();

const socket = io.connect('http://localhost:1', { query: {
    token: process.env["TEST_OAUTH2_ACCESS_TOKEN"],
    guildId: process.env["TEST_GUILD_ID"]
} });

socket.onAny((eventName, { nonce, data }) => {
    console.dir({
        op: eventName,
        nonce,
        data
    }, { breakLength: 2, depth: 1 });
})

function send(op, data) {
    socket.emit(op, data);
}

module.exports = socket;
module.exports.send = send;