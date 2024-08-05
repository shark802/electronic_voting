"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.landingPage = void 0;
function landingPage(req, res, next) {
    try {
        res.render("landingPage");
    }
    catch (error) {
        return next(error);
    }
}
exports.landingPage = landingPage;
