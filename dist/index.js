"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ws_1 = require("ws");
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var auth_1 = __importDefault(require("./routers/auth"));
require("dotenv/config");
var app = (0, express_1["default"])();
var server = http_1["default"].createServer(app);
var wss = new ws_1.WebSocketServer({ server: server });
app.use(express_1["default"].urlencoded({ extended: false }));
app.use(require('cors')());
new auth_1["default"]({ app: app, wss: wss });
server.listen(process.env.PORT, function () {
    console.log("Server is running on port ".concat(process.env.PORT, " (http://localhost:").concat(process.env.PORT, ")"));
});
