import { Election } from "./types/Election";

export function isElectionEnded(election: Election) {
    const PRESENT_DATETIME = new Date();

    let electionEndDateTime = new Date(election.date_end);
    const [hour, minute] = election.time_end.split(':');
    electionEndDateTime.setHours(Number(hour), Number(minute));

    return PRESENT_DATETIME >= electionEndDateTime ? true : false;
}