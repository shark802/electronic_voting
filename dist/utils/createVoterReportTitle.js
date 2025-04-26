"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVoterReportTitle = void 0;
function createVoterReportTitle(voteStatus, department, program, yearLevel, section) {
    let reportTitle = "List of";
    if (voteStatus === 0) {
        reportTitle += " Students Who Have Not Voted";
    }
    else if (voteStatus === 1) {
        reportTitle += " Students Who Have Voted";
    }
    else {
        reportTitle += " Students";
    }
    const details = [];
    if (department) {
        details.push(`${department} Department`);
    }
    if (program) {
        let programStr = program;
        if (yearLevel) {
            programStr += ` ${yearLevel}`;
        }
        if (section) {
            programStr += `-${section}`;
        }
        details.push(programStr);
    }
    if (details.length > 0) {
        reportTitle += ` – ${details.join(", ")}`;
    }
    return reportTitle;
}
exports.createVoterReportTitle = createVoterReportTitle;
