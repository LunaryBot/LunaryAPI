"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var BaseRouter_1 = __importDefault(require("../structures/BaseRouter"));
var express_1 = require("express");
var Utils_1 = __importDefault(require("../utils/Utils"));
var AuthRouter = /** @class */ (function (_super) {
    __extends(AuthRouter, _super);
    function AuthRouter(data) {
        var _this = _super.call(this, {
            wss: data.wss,
            app: data.app,
            router: (0, express_1.Router)(),
            path: '/auth'
        }) || this;
        _this.router.get('/callback', function (req, res) {
            var code = req.query.code;
            var token = Utils_1["default"].generateToken();
            res.redirect("".concat(process.env.WEBSITE_URL, "/login?token=").concat(token));
        });
        _this.router.get('/', function (req, res) {
            res.send('Hey');
        });
        return _this;
    }
    return AuthRouter;
}(BaseRouter_1["default"]));
exports["default"] = AuthRouter;
