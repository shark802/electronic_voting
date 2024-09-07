"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.landingPage = void 0;
function landingPage(req, res, next) {
    try {
        const user = req.session.user;
        res.render("landingPage", { user });
    }
    catch (error) {
        return next(error);
    }
}
exports.landingPage = landingPage;
