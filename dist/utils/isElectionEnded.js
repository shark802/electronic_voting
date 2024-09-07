"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isElectionEnded = void 0;
function isElectionEnded(election) {
    const PRESENT_DATETIME = new Date();
    let electionEndDateTime = new Date(election.date_end);
    const [hour, minute] = election.time_end.split(':');
    electionEndDateTime.setHours(Number(hour), Number(minute));
    return PRESENT_DATETIME >= electionEndDateTime ? true : false;
}
exports.isElectionEnded = isElectionEnded;
