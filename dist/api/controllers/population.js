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
exports.updateVoterPopulationFunction = void 0;
const customErrors_1 = require("../../utils/customErrors");
const database_1 = require("../../config/database");
function updateVoterPopulationFunction(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const electionId = req.params.id;
            const { total, populationPerProgram } = req.body;
            if (!electionId)
                throw new customErrors_1.BadRequestError('Cannot find election id');
            // if (populationPerProgram instanceof Object || Object.keys(populationPerProgram).length === 0) throw new BadRequestError('Invalid data for population');
            const connection = yield database_1.pool.getConnection();
            try {
                yield connection.beginTransaction();
                const [updateTotalPopulation] = yield connection.execute('UPDATE elections SET total_populations = ? WHERE election_id = ?', [total, electionId]);
                if (updateTotalPopulation.affectedRows === 0)
                    throw new customErrors_1.NotFoundError('No changes applied to total populations for election');
                for (const [key, value] of Object.entries(populationPerProgram)) {
                    const [updatePopulationPerProgram] = yield connection.execute('UPDATE program_populations SET program_population = ? WHERE election_id = ? AND program_code = ?', [value, electionId, key]);
                    if (updatePopulationPerProgram.affectedRows === 0)
                        throw new customErrors_1.NotFoundError(`No changes applied to update ${key} population`);
                }
                yield connection.commit();
                res.status(200).json({ message: "Update successful" });
            }
            catch (error) {
                yield connection.rollback();
                next(error);
            }
            finally {
                yield connection.release();
            }
        }
        catch (error) {
            next(error);
        }
    });
}
exports.updateVoterPopulationFunction = updateVoterPopulationFunction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wdWxhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29udHJvbGxlcnMvcG9wdWxhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSwyREFBMEU7QUFDMUUsb0RBQTZDO0FBSTdDLFNBQXNCLDZCQUE2QixDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7O1FBQy9GLElBQUksQ0FBQztZQUNELE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1lBQ2pDLE1BQU0sRUFBRSxLQUFLLEVBQUUsb0JBQW9CLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBRWpELElBQUksQ0FBQyxVQUFVO2dCQUFFLE1BQU0sSUFBSSw4QkFBZSxDQUFDLHlCQUF5QixDQUFDLENBQUM7WUFDdEUsMEpBQTBKO1lBRTFKLE1BQU0sVUFBVSxHQUFHLE1BQU0sZUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQzlDLElBQUksQ0FBQztnQkFDRCxNQUFNLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUVwQyxNQUFNLENBQUMscUJBQXFCLENBQUMsR0FBRyxNQUFNLFVBQVUsQ0FBQyxPQUFPLENBQWtCLGtFQUFrRSxFQUFFLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ25LLElBQUkscUJBQXFCLENBQUMsWUFBWSxLQUFLLENBQUM7b0JBQUUsTUFBTSxJQUFJLDRCQUFhLENBQUMsc0RBQXNELENBQUMsQ0FBQztnQkFFOUgsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDO29CQUM5RCxNQUFNLENBQUMsMEJBQTBCLENBQUMsR0FBRyxNQUFNLFVBQVUsQ0FBQyxPQUFPLENBQWtCLGtHQUFrRyxFQUFFLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUM3TSxJQUFJLDBCQUEwQixDQUFDLFlBQVksS0FBSyxDQUFDO3dCQUFFLE1BQU0sSUFBSSw0QkFBYSxDQUFDLGdDQUFnQyxHQUFHLGFBQWEsQ0FBQyxDQUFDO2dCQUNqSSxDQUFDO2dCQUVELE1BQU0sVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUMxQixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxDQUFDLENBQUE7WUFDMUQsQ0FBQztZQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7Z0JBQ2IsTUFBTSxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoQixDQUFDO29CQUFTLENBQUM7Z0JBQ1AsTUFBTSxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUE7WUFDOUIsQ0FBQztRQUVMLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hCLENBQUM7SUFDTCxDQUFDO0NBQUE7QUFoQ0Qsc0VBZ0NDIn0=