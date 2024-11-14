"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVoterReportTitle = void 0;
function createVoterReportTitle(voteStatus, department, program, yearLevel, section) {
    let reportTitle = "List of";
    if (voteStatus === 0) {
        reportTitle += ' Not Voted';
    }
    if (voteStatus === 1) {
        reportTitle += ' Voted';
    }
    if (department) {
        reportTitle += ` in ${department} Department`;
    }
    if (program) {
        reportTitle += `, ${program}`;
    }
    if (yearLevel) {
        reportTitle += ` ${yearLevel}`;
    }
    if (program && section) {
        reportTitle += `-${section}`;
    }
    reportTitle += ` students`;
    return reportTitle;
}
exports.createVoterReportTitle = createVoterReportTitle;
