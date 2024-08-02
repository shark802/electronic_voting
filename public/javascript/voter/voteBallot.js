import { showSwalErrorToast } from "/javascript/helper/sweetAlertFunctions.js";


document.querySelector("#ballot-form").addEventListener('submit', async (event) => {
    event.preventDefault();

    const selectedCandidate = getSelectedCandidatePerPosition(event);

    try {
        const selectedCandidateInfo = await fetchSelectedCandidateInfo(selectedCandidate)
        console.log(selectedCandidateInfo);
    } catch (error) {
        console.error(error);

    }
})

/* Helper Functions */

// Retrieves voter selected candidates after submit the ballot form.
// Return an object mapping position labels (as keys) to the values of the selected candidates id number.
function getSelectedCandidatePerPosition(event) {
    let castedVote = {}
    event.target.querySelectorAll("section").forEach(position => {
        const positionCandidateRun = position.querySelector('#position-label').textContent.trim();
        const selectedCandidate = position.querySelector('input[type=radio]:checked');

        const key = positionCandidateRun.toLowerCase().replace(/\s+/g, '_');
        if (selectedCandidate) {
            castedVote[key] = selectedCandidate.value;
        }
    });

    return castedVote;
}

function dispalyConfirmVoteModal(event) {

}

// send request to fetch candidate info of selected candidate
async function fetchSelectedCandidateInfo(selectedCandidateObject) {
    try {
        const urlParams = Object.values(selectedCandidateObject).map(candidate => `id_number=${candidate}`).join('&');
        const url = `/api/candidate-info?${urlParams}`

        const response = await fetch(url);
        const responseObject = await response.json();
        if (!response.ok) {
            return showSwalErrorToast(responseObject.message)
        }

        return responseObject;
    } catch (error) {
        console.error(error);
    }
}