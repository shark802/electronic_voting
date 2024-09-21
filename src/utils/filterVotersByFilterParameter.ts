import { DEPARTMENT } from "../config/constants/BccDepartments";
import { User } from "./types/User";
import { Voter } from "./types/Voter";

export function filterVotersByFilterParameter(
    voters: (Partial<User> & Partial<Voter>)[],
    voteStatus: number,
    department?: string,
    program?: string,
    yearLevel?: string,
    section?: string
): (Partial<User> & Partial<Voter>)[] {

    let filteredVoters = [...voters];

    if (voteStatus === 0 || voteStatus === 1) {
        filteredVoters = filteredVoters.filter(voter => voter.voted === voteStatus);
    }

    if (department) {

        const departmentPrograms = Object.values(DEPARTMENT[department as keyof typeof DEPARTMENT]);

        // filter each voter if their course property is part of department selected
        filteredVoters = filteredVoters.filter(voter =>
            voter.course !== undefined && departmentPrograms.includes(voter.course as typeof departmentPrograms[number])
        );
    }

    if (program) {
        filteredVoters = filteredVoters.filter(voter => voter.course === program);
    }

    if (yearLevel) {

        filteredVoters = filteredVoters.filter(voter => voter?.year_level === parseInt(yearLevel));
    }

    if (program && section) {
        filteredVoters = filteredVoters.filter(voter => voter.section === section);

    }

    return filteredVoters;
}
