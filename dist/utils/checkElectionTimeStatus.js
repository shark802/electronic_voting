"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isElectionStarted = exports.isElectionEnded = void 0;
function isElectionEnded(election) {
    const PRESENT_DATETIME = new Date();
    let electionEndDateTime = new Date(election.date_end);
    const [hour, minute] = election.time_end.split(':');
    electionEndDateTime.setHours(Number(hour), Number(minute));
    return PRESENT_DATETIME >= electionEndDateTime;
}
exports.isElectionEnded = isElectionEnded;
function isElectionStarted(election) {
    const PRESENT_DATETIME = new Date();
    let electionStartDateTime = new Date(election.date_start);
    const [hour, minute] = election.time_start.split(':');
    electionStartDateTime.setHours(Number(hour), Number(minute));
    return PRESENT_DATETIME >= electionStartDateTime;
}
exports.isElectionStarted = isElectionStarted;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tFbGVjdGlvblRpbWVTdGF0dXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvY2hlY2tFbGVjdGlvblRpbWVTdGF0dXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsU0FBZ0IsZUFBZSxDQUFDLFFBQWtCO0lBQzlDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUVwQyxJQUFJLG1CQUFtQixHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN0RCxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BELG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFFM0QsT0FBTyxnQkFBZ0IsSUFBSSxtQkFBbUIsQ0FBQztBQUNuRCxDQUFDO0FBUkQsMENBUUM7QUFFRCxTQUFnQixpQkFBaUIsQ0FBQyxRQUFrQjtJQUNoRCxNQUFNLGdCQUFnQixHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7SUFFcEMsSUFBSSxxQkFBcUIsR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDMUQsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN0RCxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBRTdELE9BQU8sZ0JBQWdCLElBQUkscUJBQXFCLENBQUM7QUFDckQsQ0FBQztBQVJELDhDQVFDIn0=