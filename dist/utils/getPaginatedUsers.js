"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginatedUsers = void 0;
function getPaginatedUsers(users, page, pageSize = 30) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return users.slice(startIndex, endIndex);
}
exports.getPaginatedUsers = getPaginatedUsers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0UGFnaW5hdGVkVXNlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvZ2V0UGFnaW5hdGVkVXNlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBR0EsU0FBZ0IsaUJBQWlCLENBQUMsS0FBeUMsRUFBRSxJQUFZLEVBQUUsV0FBbUIsRUFBRTtJQUU1RyxNQUFNLFVBQVUsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUM7SUFDekMsTUFBTSxRQUFRLEdBQUcsVUFBVSxHQUFHLFFBQVEsQ0FBQztJQUV2QyxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzdDLENBQUM7QUFORCw4Q0FNQyJ9