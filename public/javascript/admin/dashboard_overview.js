import { confirmErrorAlert, confirmAlert, showSwalSuccessToast, showSwalErrorToast } from "/javascript/helper/sweetAlertFunctions.js"
import "/javascript/logout.js"

const dashboard_nav = document.querySelector("#dashboard_nav")
const overview_page = document.querySelector("#overview_page")

dashboard_nav.classList.remove("font-normal")
dashboard_nav.classList.add("active-page")

overview_page.classList.add("active-nav")
$("#dashboard_subpage").slideDown(500);

document.querySelector("#sidebar").classList.add("hidden");

// Hide Sidebar
document.querySelector("#show-sidebar").addEventListener("click", () => {
    $("#sidebar").show(100);
});
// Show Sidebar
document.querySelector("#hide-sidebar").addEventListener('click', () => {
    $("#sidebar").hide(100);
});


document.addEventListener('DOMContentLoaded', async () => {

    const electionIdList = Array.from(document.querySelectorAll('#election-section')).map(election => election.dataset.electionId);
    const programCode = document.querySelector('#program').value;
    const urlParams = electionIdList.map(electionId => `election_id=${electionId}`).join('&');

    const electionTotalPopulation = await fetchElectionTotalPopulation(urlParams);
    const electionTotalVoted = await fetchElectionTotalVoted(urlParams);

    // display the summary of total population, voted, not voted by election
    displayElectionPopulationInDashboard(electionTotalPopulation);
    displayElectionNumberOfVotedInDashboard(electionTotalVoted, electionTotalPopulation);
    displayElectionNumberOfNotVotedInDashboard(electionTotalPopulation, electionTotalVoted);

    const programPopulation = await fetchTotalPopulationByProgram(urlParams);
    const programVoteCount = await fetchProgramTotalVoteCount(urlParams);


    // display the total population, number of voted and not voted by program (depends on program head's program)
    displayProgramTotalPopulation(programPopulation);
    displayTotalVoteCountInProgram(programVoteCount);
    displayProgramNumberOfNotVoted(programPopulation, programVoteCount);
})


// helper functions

async function fetchElectionTotalPopulation(urlParams) { // return array of objects {election_id, total_populations}
    try {
        const url = `/api/election-population?${urlParams}`
        const response = await fetch(url);
        const responseObject = await response.json()

        if (!response.ok) return showSwalErrorToast(responseObject.message);

        return responseObject.elections;
    } catch (error) {
        console.error(error);
    }
}

function displayElectionPopulationInDashboard(electionTotalPopulationArrayObject) {

    electionTotalPopulationArrayObject.forEach(electionObject => {
        if (electionObject.total_populations > 0) {
            const electionSection = document.body.querySelector(`section[data-election-id="${electionObject.election_id}"]`);
            electionSection.querySelector('#total-population').textContent = electionObject.total_populations
        }
    })
}

async function fetchElectionTotalVoted(urlParams) { // return array of objects {election_id, voted}. voted property contains the total number of voted in election 
    try {
        const url = `/api/election-voted?${urlParams}`
        const response = await fetch(url);
        const responseObject = await response.json()

        if (!response.ok) return showSwalErrorToast(responseObject.message);

        return responseObject.elections;
    } catch (error) {
        console.error(error);
    }
}

function displayElectionNumberOfVotedInDashboard(electionTotalVotedArrayObject, electionTotalPopulationArrayObject) {

    electionTotalVotedArrayObject.forEach((electionObject) => {
        if (electionObject.voted > 0) {
            const electionSection = document.body.querySelector(`section[data-election-id="${electionObject.election_id}"]`);

            const findElectionsTotalPopulation = electionTotalPopulationArrayObject.find(election => election.election_id === electionObject.election_id);
            const totalPopulation = findElectionsTotalPopulation.total_populations;

            electionSection.querySelector('#total-voted').textContent = electionObject.voted;

            // display election turnout percentage if total population is truthy (not zero)
            if (totalPopulation) {
                const votedPercentage = ((electionObject.voted / totalPopulation) * 100).toFixed(2);
                electionSection.querySelector('#total-voted-percentage').textContent = `(${votedPercentage}%)`;
            }
        }
    })
}

function displayElectionNumberOfNotVotedInDashboard(electionTotalPopulationArrayObject, electionTotalVotedArrayObject) {

    electionTotalPopulationArrayObject.forEach(election => {

        const electionSection = document.body.querySelector(`section[data-election-id="${election.election_id}"]`);
        const findElectionTotalVoted = electionTotalVotedArrayObject.find(electionObject => electionObject.election_id === election.election_id);

        if (election.total_populations) {
            const numberOfNotVoted = findElectionTotalVoted ? (election.total_populations - findElectionTotalVoted.voted) : election.total_populations;
            const numberOfNotVotedPercentage = ((numberOfNotVoted / election.total_populations) * 100).toFixed(2);

            electionSection.querySelector('#number-of-not-voted').textContent = numberOfNotVoted;
            electionSection.querySelector('#total-not-voted-percentage').textContent = `(${numberOfNotVotedPercentage}%)`;
        }
    })
}

async function fetchTotalPopulationByProgram(urlParams) {
    try {
        const url = `/api/program-population?${urlParams}`
        const response = await fetch(url);
        const responseObject = await response.json()

        if (!response.ok) return showSwalErrorToast(responseObject.message);

        return responseObject.electionPopulationSummary;
    } catch (error) {
        console.error(error);
    }
}

async function fetchProgramTotalVoteCount(urlParams) {
    try {
        const response = await fetch(`/api/program-voted?${urlParams}`);

        const responseObject = await response.json()
        if (!response.ok) return showSwalErrorToast(responseObject.message);

        return responseObject.electionVoteSummary;
    } catch (error) {
        console.error(error);
    }
}

function displayProgramTotalPopulation(programPopulationObject) {

    programPopulationObject.forEach(program => {
        if (program.program_population > 0) {
            const electionSection = document.querySelector(`section[data-election-id="${program.election_id}"]`);
            electionSection.querySelector('#program-population').textContent = program.program_population;
        }
    })
}

function displayTotalVoteCountInProgram(programVoteCountObject) {

    programVoteCountObject.forEach(electionVotesSummary => {

        const electionSection = document.body.querySelector(`section[data-election-id="${electionVotesSummary.election_id}"]`);

        electionSection.querySelectorAll('#program').forEach(department => {
            const departmentCode = department.querySelector('#program-code').dataset.programCode

            department.querySelector('#departmentTotalVotes').textContent = electionVotesSummary.department_votes[departmentCode];
        });
    })
}

function displayProgramNumberOfNotVoted(programPopulationObject, programVoteCountObject) {

    programPopulationObject.forEach(program => {

        if (program.program_population > 0) {
            const electionSection = document.body.querySelector(`section[data-election-id="${program.election_id}"]`);

            const findProgramVoteCount = programVoteCountObject.find(programObject => programObject.election_id === program.election_id);
            const programPopulation = program.program_population;
            const numberOfNotVoted = findProgramVoteCount ? (programPopulation - findProgramVoteCount.total_voted) : programPopulation;

            electionSection.querySelector('#program-number-of-not-voted').textContent = numberOfNotVoted;
        }
    })
}

// /**
//  * This function accept array of election id and find each elections available department code (ex. AB, CRIM, EDUC, IS)
//  *  
//  * @param {Array} electionIdList - array of election id
//  * @returns {Array}- return a key value pair array. Key is electionId value is array contains department code
//  */
// function getAllDepartmentPerElection(electionIdList) {

//     const departmentsForEachElection = electionIdList.reduce((electionObject, electionId) => {
//         const electionSection = document.body.querySelector(`section[data-election-id="${electionId}"]`);

//         // Collect department codes for each election
//         const departmentsOnEachElection = Array.from(electionSection.querySelectorAll('#program-code')).reduce((programArray, programCode) => {
//             programArray.push(programCode.textContent);
//             return programArray;
//         }, []);

//         // Add departments array to the electionObject
//         electionObject[electionId] = departmentsOnEachElection;
//         return electionObject; // Return the updated electionObject
//     }, {});

//     return departmentsForEachElection;
// }

document.querySelectorAll('section').forEach(electionSection => {
    const dateEnd = electionSection.querySelector('#date-end')?.value;
    const timeEnd = electionSection.querySelector('#time-end')?.value;

    if (!dateEnd || !timeEnd) {
        console.warn('Date or time is missing');
        return;
    }

    const PRESENT_DATE = new Date();
    const endDate = new Date(dateEnd);

    if (isNaN(endDate.getTime())) {
        console.warn('Invalid date format:', dateEnd);
        return;
    }

    const [hourEnd, minuteEnd] = timeEnd.split(':');
    endDate.setHours(hourEnd, minuteEnd);

    if (PRESENT_DATE > endDate) {
        electionSection.querySelector('#manage').style.display = 'block';
    }
});



document.querySelector('#overview-container').addEventListener('click', (event) => {
    if (!event.target.closest('#manage')) return;

    const electionContainerSection = event.target.closest('section');

    const electionId = electionContainerSection.querySelector('#election-id').textContent.trim();
    const dateEnd = electionContainerSection.querySelector('#date-end').value;
    const timeEnd = electionContainerSection.querySelector('#time-end').value;

    const PRESENT_DATE = new Date();
    const endDate = new Date(dateEnd);
    const [hourEnd, minuteEnd] = timeEnd.split(':');
    endDate.setHours(hourEnd, minuteEnd);

    if (PRESENT_DATE > endDate) {

        const dateString = endDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const timeString = endDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

        const formattedDateTime = `${dateString} ${timeString}`;

        // This display the date and time when modal is display after ended
        document.querySelector('#close-election').querySelector('underline').textContent = formattedDateTime;
        document.querySelector('#close-election').querySelector('#election-id').value = electionId;
        document.querySelector('#close-election').showModal();
    }
})

document.querySelector('#exit-close-election-modal').addEventListener('click', (event) => event.target.closest('dialog').close());

confirmCloseElection();

function confirmCloseElection() {
    document.querySelector('#close-election-button').addEventListener('click', async () => {
        document.querySelector('#close-election').close();

        const electionId = document.querySelector('#close-election').querySelector('#election-id').value;
        console.log(electionId);

        const action = await confirmAlert('Are you sure you want to close the election dashboard?')
        if (!action.isConfirmed) return document.querySelector('#close-election').showModal();

        try {
            const response = await putRequestToCloseElection(electionId);
            const responseObject = await response.json();

            if (!response.ok) {
                return confirmErrorAlert(responseObject.message);
            }

            document.querySelector(`section[data-election-id="${electionId}"]`).remove();
            return showSwalSuccessToast(responseObject.message);
        } catch (error) {
            console.log(error);
        }

    })
}

async function putRequestToCloseElection(electionId) {
    const result = await fetch(`/api/election-overview/${electionId}`, {
        method: 'PUT',
    })
    return result;
}