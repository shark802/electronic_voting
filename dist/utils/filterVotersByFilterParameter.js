"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterVotersByFilterParameter = void 0;
const database_1 = require("../config/database");
const query_1 = require("../data_access/query");
function filterVotersByFilterParameter(voters, voteStatus, department, program, yearLevel, section) {
    return __awaiter(this, void 0, void 0, function* () {
        const departmentId = department ? (yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM departments WHERE department_code = ?', [department])).map(department => department.department_id) : [];
        let filteredVoters = [...voters];
        if (voteStatus === 0 || voteStatus === 1) {
            filteredVoters = filteredVoters.filter(voter => voter.voted === voteStatus);
        }
        if (department) {
            const departmentPrograms = yield (yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM programs WHERE department IN ( ? ) AND deleted_at IS NULL', [departmentId])).map(program => program.program_code);
            // filter each voter if their course property is part of department selected
            filteredVoters = filteredVoters.filter(voter => voter.course !== undefined && departmentPrograms.includes(voter.course));
        }
        if (program) {
            filteredVoters = filteredVoters.filter(voter => voter.course === program);
        }
        if (yearLevel) {
            filteredVoters = filteredVoters.filter(voter => (voter === null || voter === void 0 ? void 0 : voter.year_level) === parseInt(yearLevel));
        }
        if (program && section) {
            filteredVoters = filteredVoters.filter(voter => voter.section === section);
        }
        return filteredVoters;
    });
}
exports.filterVotersByFilterParameter = filterVotersByFilterParameter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyVm90ZXJzQnlGaWx0ZXJQYXJhbWV0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvZmlsdGVyVm90ZXJzQnlGaWx0ZXJQYXJhbWV0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsaURBQTBDO0FBQzFDLGdEQUFtRDtBQU1uRCxTQUFzQiw2QkFBNkIsQ0FDL0MsTUFBMEMsRUFDMUMsVUFBa0IsRUFDbEIsVUFBbUIsRUFDbkIsT0FBZ0IsRUFDaEIsU0FBa0IsRUFDbEIsT0FBZ0I7O1FBR2hCLE1BQU0sWUFBWSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUEsbUJBQVcsRUFBYSxlQUFJLEVBQUUscURBQXFELEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFFOUwsSUFBSSxjQUFjLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBRWpDLElBQUksVUFBVSxLQUFLLENBQUMsSUFBSSxVQUFVLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDdkMsY0FBYyxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLFVBQVUsQ0FBQyxDQUFDO1FBQ2hGLENBQUM7UUFFRCxJQUFJLFVBQVUsRUFBRSxDQUFDO1lBRWIsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFBLG1CQUFXLEVBQVUsZUFBSSxFQUFFLHlFQUF5RSxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUVwTSw0RUFBNEU7WUFDNUUsY0FBYyxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FDM0MsS0FBSyxDQUFDLE1BQU0sS0FBSyxTQUFTLElBQUksa0JBQWtCLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUEyQyxDQUFDLENBQy9HLENBQUM7UUFDTixDQUFDO1FBRUQsSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUNWLGNBQWMsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxPQUFPLENBQUMsQ0FBQztRQUM5RSxDQUFDO1FBRUQsSUFBSSxTQUFTLEVBQUUsQ0FBQztZQUVaLGNBQWMsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsVUFBVSxNQUFLLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQy9GLENBQUM7UUFFRCxJQUFJLE9BQU8sSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUNyQixjQUFjLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssT0FBTyxDQUFDLENBQUM7UUFFL0UsQ0FBQztRQUVELE9BQU8sY0FBYyxDQUFDO0lBQzFCLENBQUM7Q0FBQTtBQTFDRCxzRUEwQ0MifQ==