"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidTimeToVote = void 0;
function isValidTimeToVote(election) {
    const PRESENT_DATE_TIME = new Date();
    const startDateAndTime = dateFormatter(election.date_start, election.time_start);
    const endDateAndTime = dateFormatter(election.date_end, election.time_end);
    if (PRESENT_DATE_TIME >= startDateAndTime && PRESENT_DATE_TIME <= endDateAndTime)
        return true;
    return false;
}
exports.isValidTimeToVote = isValidTimeToVote;
function dateFormatter(date, time) {
    let dateToFormat = new Date(date);
    const [hour, minute] = time.split(":").map(Number);
    dateToFormat.setHours(hour, minute);
    return dateToFormat;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNWYWxpZFRpbWVUb1ZvdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvaXNWYWxpZFRpbWVUb1ZvdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsU0FBZ0IsaUJBQWlCLENBQUMsUUFBa0I7SUFDaEQsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0lBQ3JDLE1BQU0sZ0JBQWdCLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2pGLE1BQU0sY0FBYyxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUUzRSxJQUFJLGlCQUFpQixJQUFJLGdCQUFnQixJQUFJLGlCQUFpQixJQUFJLGNBQWM7UUFBRSxPQUFPLElBQUksQ0FBQztJQUU5RixPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDO0FBUkQsOENBUUM7QUFFRCxTQUFTLGFBQWEsQ0FBQyxJQUFZLEVBQUUsSUFBWTtJQUM3QyxJQUFJLFlBQVksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ2xELFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3BDLE9BQU8sWUFBWSxDQUFDO0FBQ3hCLENBQUMifQ==