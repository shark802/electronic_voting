import { showSwalErrorToast } from "/javascript/helper/sweetAlertFunctions.js";
import { showLoading, hideLoader } from "/javascript/helper/loader.js";
import { confirmAlert } from "/javascript/helper/sweetAlertFunctions.js";


document.querySelector("#ballot-form").addEventListener('submit', async (event) => {
    event.preventDefault();

    const selectedCandidate = getSelectedCandidatePerPosition(event);

    try {
        const candidateObjectArray = await fetchSelectedCandidateInfo(selectedCandidate); // fetch info of candidate selected
        displayConfirmVoteModal(candidateObjectArray); // display the candidate info to confirm

        document.addEventListener('click', async (event) => {
            if (event.target.id === "cancel-vote") {
                event.target.closest('dialog').remove();
                return;
            } else if (event.target.id === "submit-vote") {
                const response = await submitVote(selectedCandidate);
                const responseObject = await response.json();

                if (!response.ok) return showSwalErrorToast(responseObject.message);

                const action = await confirmAlert(responseObject.message);
                if (action.confirm) {
                    window.location.href = "/election";
                }
            }
        })

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

function displayConfirmVoteModal(candidateObjectArray) {
    hideLoader();

    if (!candidateObjectArray || candidateObjectArray.length < 1) return;
    const confirmModal = document.createElement('dialog');
    confirmModal.id = "confirm-modal";
    confirmModal.classList.add('confirm-modal');
    document.body.append(confirmModal);

    document.querySelector('#confirm-modal').innerHTML += `
        <div class="font-semibold py-4">
            <h2>Please confirm before you cast</h2>
        </div>
     `

    candidateObjectArray.map(candidateObject => {
        document.querySelector('#confirm-modal').innerHTML += `
            <div class="flex flex-1 w-full flex-col pb-3 justify-center">
                <p class="text-gray-500 text-sm">${candidateObject.position}: </p>
                <p class="lg:text-lg">${candidateObject.firstname} ${candidateObject.lastname}</p>
            </div>
        `
    });

    document.querySelector('#confirm-modal').innerHTML += `
        <div class="absolute w-fit bottom-0 mb-4 float-right left-1/2 transform -translate-x-1/2 flex gap-4">
            <button id="cancel-vote" class="text-gray-500 text-sm hover:text-white py-1 px-2 rounded-md hover:bg-gray-300">Cancel</button>
            <button id="submit-vote" class="bg-blue-500 text-white py-1 px-3 font-semibold rounded-md">Cast vote</button>
        </div>
     `

    confirmModal.showModal();
}

// send request to fetch candidate info of selected candidate
async function fetchSelectedCandidateInfo(selectedCandidateObject) {
    try {
        const urlParams = Object.values(selectedCandidateObject).map(candidate => `id_number=${candidate}`).join('&');
        const url = `/api/candidate-info?${urlParams}`

        showLoading();
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

async function submitVote(selectedCandidateObject) {
    try {
        console.log(selectedCandidateObject);
        showLoading();
        const response = await fetch('/api/vote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(selectedCandidateObject)
        });

        hideLoader();
        return response;
    } catch (error) {
        console.error(error);
    }
}