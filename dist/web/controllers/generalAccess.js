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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhbEFjY2Vzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy93ZWIvY29udHJvbGxlcnMvZ2VuZXJhbEFjY2Vzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxTQUFnQixXQUFXLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtJQUN2RSxJQUFJLENBQUM7UUFDRCxHQUFHLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0lBQzdCLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDdEIsQ0FBQztBQUVMLENBQUM7QUFQRCxrQ0FPQyJ9