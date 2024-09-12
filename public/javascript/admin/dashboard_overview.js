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

    // const programPopulation = await fetchTotalPopulationByProgram(departmentsPerElectionArray);
    const programVoteCount = await fetchProgramTotalVoteCount(urlParams);

    console.log(programVoteCount);

    // display the total population, number of voted and not voted by program (depends on program head's program)
    displayProgramTotalPopulation(programPopulation);
    displayTotalVoteCountInProgram(programVoteCount, programPopulation);
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

async function fetchTotalPopulationByProgram(programCode, urlParams) {
    try {
        const url = `/api/program-population?program=${programCode}&${urlParams}`
        const response = await fetch(url);
        const responseObject = await response.json()

        if (!response.ok) return showSwalErrorToast(responseObject.message);

        return responseObject.programPopulation;
    } catch (error) {
        console.error(error);
    }
}

async function fetchProgramTotalVoteCount(urlParams) {
    try {
        const response = await fetch(`/api/program-voted?${urlParams}`);

        const responseObject = await response.json()
        if (!response.ok) return showSwalErrorToast(responseObject.message);

        return responseObject.programVoteCount;
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

    programVoteCountObject.forEach(programVoteCount => {
        if (programVoteCount.total_voted > 0) {
            const electionSection = document.body.querySelector(`section[data-election-id="${programVoteCount.election_id}"]`);
            electionSection.querySelector('#program-vote-count').textContent = programVoteCount.total_voted;
        }
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

/**
 * This function accept array of election id and find each elections available department code (ex. AB, CRIM, EDUC, IS)
 *  
 * @param {Array} electionIdList - array of election id
 * @returns {Array}- return a key value pair array. Key is electionId value is array contains department code
 */
function getAllDepartmentPerElection(electionIdList) {

    const departmentsForEachElection = electionIdList.reduce((electionObject, electionId) => {
        const electionSection = document.body.querySelector(`section[data-election-id="${electionId}"]`);

        // Collect department codes for each election
        const departmentsOnEachElection = Array.from(electionSection.querySelectorAll('#program-code')).reduce((programArray, programCode) => {
            programArray.push(programCode.textContent);
            return programArray;
        }, []);

        // Add departments array to the electionObject
        electionObject[electionId] = departmentsOnEachElection;
        return electionObject; // Return the updated electionObject
    }, {});

    return departmentsForEachElection;
}


// Event listener for closing the modal
// document.querySelector('#close-modal').addEventListener('click', (event) => event.target.closest('dialog').close())
// document.querySelector('#exit-close-election-modal').addEventListener('click', (event) => event.target.closest('dialog').close());

// confirmCloseElection();

// function confirmCloseElection() {
//     document.querySelector('#exit-close-election-button').addEventListener('click', async () => {
//         document.querySelector('#close-election').close();

//         const electionId = document.querySelector('#close-election').querySelector('#election-id').value;

//         const action = await confirmAlert('Are you sure you want to close the election dashboard?')
//         if (!action.isConfirmed) return document.querySelector('#close-election').showModal();

//         try {
//             const response = await putRequestToCloseElection(electionId);
//             const responseObject = await response.json();

//             if (!response.ok) {
//                 return confirmErrorAlert(responseObject.message);
//             }

//             document.querySelector(`section[data-election-id="${electionId}"]`).remove();
//             return showSwalSuccessToast(responseObject.message);
//         } catch (error) {
//             console.log(error);
//         }

//     })
// }


// async function putRequestToCloseElection(electionId) {
//     const result = await fetch(`/api/election-overview/${electionId}`, {
//         method: 'PUT',
//     })
//     return result;
// }