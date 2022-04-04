"use strict";
exports.__esModule = true;
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.generateToken = function () {
        return (Date.now().toString(36) + Array(4).fill(0).map(function () { return Math.random().toString(36); }).join('')).split('').map(function (c) { return Math.random() > 0.5 ? c.toUpperCase() : c; }).join('').replace(/\./g, '');
    };
    return Utils;
}());
exports["default"] = Utils;
