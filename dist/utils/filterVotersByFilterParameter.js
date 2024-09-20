"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterVotersByFilterParameter = void 0;
const BccDepartments_1 = require("../config/constants/BccDepartments");
function filterVotersByFilterParameter(voters, voteStatus, department, program, yearLevel) {
    let filteredVoters = [...voters];
    if (voteStatus === 0 || voteStatus === 1) {
        filteredVoters = filteredVoters.filter(voter => voter.voted === voteStatus);
    }
    if (department) {
        const departmentPrograms = Object.values(BccDepartments_1.DEPARTMENT[department]);
        // filter each voter if their course property is part of department selected
        filteredVoters = filteredVoters.filter(voter => voter.course !== undefined && departmentPrograms.includes(voter.course));
    }
    if (program) {
        filteredVoters = filteredVoters.filter(voter => voter.course === program);
    }
    if (yearLevel) {
        filteredVoters = filteredVoters.filter(voter => (voter === null || voter === void 0 ? void 0 : voter.year_level) === parseInt(yearLevel));
    }
    return filteredVoters;
}
exports.filterVotersByFilterParameter = filterVotersByFilterParameter;
