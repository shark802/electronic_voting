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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhbEFjY2Vzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy93ZWIvY29udHJvbGxlcnMvZ2VuZXJhbEFjY2Vzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxTQUFnQixXQUFXLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtJQUN2RSxJQUFJLENBQUM7UUFDRCxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQTtRQUU3QixHQUFHLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7SUFDdkMsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDYixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUN0QixDQUFDO0FBRUwsQ0FBQztBQVRELGtDQVNDIn0=