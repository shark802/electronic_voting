"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const toUpperCase_1 = require("../../middlewares/toUpperCase");
const router = (0, express_1.Router)();
router.use(toUpperCase_1.toUpperCase);
router.route('/user/:id')
    .get(user_1.getUserByIdNumber)
    .put(user_1.updateUserFunction);
router.post('/user-new', user_1.newUserFunction);
exports.default = router;
