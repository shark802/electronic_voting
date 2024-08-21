"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const candidate_1 = require("../controllers/candidate");
const toUpperCase_1 = require("../../middlewares/toUpperCase");
const router = (0, express_1.Router)();
router.use(toUpperCase_1.toUpperCase);
router.route('/candidate')
    .post(candidate_1.addCandidateFunction);
router.route('/candidate/data')
    .get(candidate_1.getAllcandidatesInActiveElection);
router
    .route("/candidate/:id")
    .put(candidate_1.updateCandidateFunction)
    .delete(candidate_1.deleteCandidateFunction)
    .get(candidate_1.getCandidateById);
router.get("/candidate", candidate_1.getManageCandidates);
router.get('/candidate-info', candidate_1.getUserCandidateData);
router.put("/candidate/status/:id", candidate_1.updateCandidateStatus);
exports.default = router;
