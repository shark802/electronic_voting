"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registerDevice_1 = require("../controllers/registerDevice");
const router = (0, express_1.Router)();
router.post('/uuid', registerDevice_1.requestUuidFunction);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXJEZXZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpL3JvdXRlcy9yZWdpc3RlckRldmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFpQztBQUNqQyxrRUFBb0U7QUFFcEUsTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBTSxHQUFFLENBQUM7QUFFeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsb0NBQW1CLENBQUMsQ0FBQztBQUUxQyxrQkFBZSxNQUFNLENBQUMifQ==