"use strict";
exports.__esModule = true;
var BaseRouter = /** @class */ (function () {
    function BaseRouter(data) {
        this.app = data.app;
        this.router = data.router;
        this.path = data.path;
        this.app.use(this.path, this.router);
    }
    return BaseRouter;
}());
exports["default"] = BaseRouter;
