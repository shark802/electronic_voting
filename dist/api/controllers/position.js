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
exports.removePosition = exports.getAllPositions = exports.addPosition = void 0;
const customErrors_1 = require("../../utils/customErrors");
const query_1 = require("../../data_access/query");
const database_1 = require("../../config/database");
function addPosition(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { position } = req.body;
            if (!position || position === "")
                throw new customErrors_1.BadRequestError("Position is required");
            const existPosition = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM positions WHERE position = ? AND deleted_at IS NULL', [position]);
            if (existPosition.length > 0)
                throw new customErrors_1.ConflictError("Position already exists");
            yield (0, query_1.insertQuery)(database_1.pool, 'INSERT INTO positions (position) VALUES (?)', [position]);
            res.status(201).json({ message: "Position added successfully" });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.addPosition = addPosition;
function getAllPositions(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const positions = yield (0, query_1.selectQuery)(database_1.pool, 'SELECT * FROM positions WHERE deleted_at IS NULL');
            res.status(200).json({ positions });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getAllPositions = getAllPositions;
function removePosition(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const positionId = req.params.id;
            console.log(positionId);
            const deletePosition = yield (0, query_1.deleteQuery)(database_1.pool, 'UPDATE positions SET deleted_at = NOW() WHERE position_id = ?', [positionId]);
            if (deletePosition.affectedRows === 0)
                throw new customErrors_1.NotFoundError("Position not found");
            res.status(200).json({ message: "Position removed successfully" });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.removePosition = removePosition;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zaXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpL2NvbnRyb2xsZXJzL3Bvc2l0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLDJEQUF5RjtBQUN6RixtREFBZ0Y7QUFFaEYsb0RBQTZDO0FBRTdDLFNBQXNCLFdBQVcsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCOztRQUM3RSxJQUFJLENBQUM7WUFDRCxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUM5QixJQUFJLENBQUMsUUFBUSxJQUFJLFFBQVEsS0FBSyxFQUFFO2dCQUFFLE1BQU0sSUFBSSw4QkFBZSxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFFcEYsTUFBTSxhQUFhLEdBQUcsTUFBTSxJQUFBLG1CQUFXLEVBQVcsZUFBSSxFQUFFLG1FQUFtRSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN6SSxJQUFJLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQztnQkFBRSxNQUFNLElBQUksNEJBQWEsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBRWpGLE1BQU0sSUFBQSxtQkFBVyxFQUFDLGVBQUksRUFBRSw2Q0FBNkMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFFbkYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsQ0FBQyxDQUFDO1FBRXJFLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hCLENBQUM7SUFDTCxDQUFDO0NBQUE7QUFmRCxrQ0FlQztBQUVELFNBQXNCLGVBQWUsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCOztRQUNqRixJQUFJLENBQUM7WUFDRCxNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUEsbUJBQVcsRUFBVyxlQUFJLEVBQUUsa0RBQWtELENBQUMsQ0FBQztZQUN4RyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFFeEMsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEIsQ0FBQztJQUNMLENBQUM7Q0FBQTtBQVJELDBDQVFDO0FBRUQsU0FBc0IsY0FBYyxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7O1FBQ2hGLElBQUksQ0FBQztZQUNELE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1lBRWpDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFeEIsTUFBTSxjQUFjLEdBQUcsTUFBTSxJQUFBLG1CQUFXLEVBQUMsZUFBSSxFQUFFLCtEQUErRCxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUM5SCxJQUFJLGNBQWMsQ0FBQyxZQUFZLEtBQUssQ0FBQztnQkFBRSxNQUFNLElBQUksNEJBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBRXJGLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLCtCQUErQixFQUFFLENBQUMsQ0FBQztRQUV2RSxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoQixDQUFDO0lBQ0wsQ0FBQztDQUFBO0FBZEQsd0NBY0MifQ==