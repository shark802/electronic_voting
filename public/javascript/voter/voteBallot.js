import { showSwalErrorToast } from "/javascript/helper/sweetAlertFunctions.js";
import { showLoading, hideLoader } from "/javascript/helper/loader.js";
import { confirmAlert } from "/javascript/helper/sweetAlertFunctions.js";
import socket from "/javascript/socket_io.js"

document.querySelector("#ballot-form").addEventListener('submit', async (event) => {
    event.preventDefault();

    const selectedCandidate = getSelectedCandidatePerPosition(event);

    // If validation failed, don't proceed
    if (selectedCandidate.length === 0) {
        return;
    }

    try {
        const candidateObjectArray = await fetchSelectedCandidateInfo(selectedCandidate); // fetch info of candidate selected
        displayConfirmVoteModal(candidateObjectArray); // display the candidate info to confirm

        const confirmModal = document.getElementById('confirm-modal');
        confirmModal.addEventListener('click', async (event) => {
            if (event.target.id === "cancel-vote") {
                confirmModal.close();
                confirmModal.remove();
            } else if (event.target.id === "submit-vote") {

                confirmModal.close();
                confirmModal.remove();
                const response = await submitVote(selectedCandidate);
                const responseObject = await response.json();

                if (!response.ok) return showSwalErrorToast(responseObject.message);

                const action = await confirmAlert(responseObject.message);
                if (action.isConfirmed) {
                    window.location.href = "/election?isVoted=true";
                }
            }
        }, { once: true });
    } catch (error) {
        console.error(error);
    }
});

/* Helper Functions */

// Retrieves voter selected candidates after submitting the ballot form.
// Returns an object mapping position labels (as keys) to the values of the selected candidates' id numbers.
function getSelectedCandidatePerPosition(event) {
    let castedVote = [];
    let hasError = false;

    event.target.querySelectorAll("section").forEach(position => {
        const positionCandidateRun = position.querySelector('#position-label').textContent.trim();
        const errorMessageContainer = document.getElementById(`error-${positionCandidateRun}`);

        // Clear previous error messages
        errorMessageContainer.style.display = 'none';
        errorMessageContainer.textContent = '';

        if (positionCandidateRun === 'SENATOR') {
            const senatorSelectedCandidates = position.querySelectorAll('input[type=checkbox]:checked');
            const maxVotes = parseInt(position.dataset.maxVote) || 12; // Default to 12 if not set
            const selectedCount = senatorSelectedCandidates.length;

            // Add selected senators to vote array
            Array.from(senatorSelectedCandidates).forEach(candidate => {
                castedVote.push({
                    position: positionCandidateRun,
                    id_number: candidate.value
                });
            });

            // Validate senator selection count - must select exactly maxVotes
            if (selectedCount !== maxVotes) {
                hasError = true;
                if (selectedCount === 0) {
                    errorMessageContainer.textContent = `Please select exactly ${maxVotes} candidates for ${positionCandidateRun}.`;
                } else if (selectedCount < maxVotes) {
                    errorMessageContainer.textContent = `Please select exactly ${maxVotes} candidates for ${positionCandidateRun}. Currently selected: ${selectedCount}.`;
                } else {
                    errorMessageContainer.textContent = `You can only select ${maxVotes} candidates for ${positionCandidateRun}. Currently selected: ${selectedCount}.`;
                }
                errorMessageContainer.style.display = 'block';
            }

        } else {
            const selectedCandidate = position.querySelector('input[type=radio]:checked');
            if (!selectedCandidate) {
                hasError = true;
                errorMessageContainer.textContent = `Please select a candidate for ${positionCandidateRun}.`;
                errorMessageContainer.style.display = 'block';
            } else {
                castedVote.push({
                    position: positionCandidateRun,
                    id_number: selectedCandidate.value
                });
            }
        }
    });

    if (hasError) {
        return []; // Return an empty array to indicate failure
    }

    return castedVote;
}

function displayConfirmVoteModal(candidateObjectArray) {
    hideLoader();

    if (!candidateObjectArray || candidateObjectArray.length < 1) return;

    // Define the desired order
    const positionOrder = ['PRESIDENT', 'VICE PRESIDENT', 'SENATOR'];

    // Sort the candidates according to the defined position order
    candidateObjectArray.sort((a, b) => {
        return positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position);
    });

    const confirmModal = document.createElement('dialog');
    confirmModal.id = "confirm-modal";
    confirmModal.classList.add('confirm-modal', 'bg-white', 'rounded-lg', 'shadow-xl', 'p-6', 'max-w-md', 'w-full', 'mx-auto', 'mx-4');
    document.body.append(confirmModal);

    confirmModal.innerHTML = `
        <div class="text-center mb-6">
            <h2 class="lg:text-2xl text-lg font-bold text-gray-800">Please Confirm Your Vote</h2>
            <p class="text-gray-600 text-sm lg:text-base mt-2">Review your selections before casting your vote</p>
        </div>
        <div class="space-y-4 mb-6 text-sm lg:text-base">
            ${candidateObjectArray.map(candidateObject => `
                <div class="bg-gray-100 p-3 rounded-md">
                    <p class="text-gray-500 text-sm font-medium">${candidateObject.position}</p>
                    <p class="text-gray-800 font-semibold">${candidateObject.firstname} ${candidateObject.lastname}</p>
                </div>
            `).join('')}
        </div>
        <div class="flex justify-end space-x-4">
            <button id="cancel-vote" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">Cancel</button>
            <button id="submit-vote" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Cast Vote</button>
        </div>
    `;

    confirmModal.showModal();
}

// Send request to fetch candidate info of selected candidate
async function fetchSelectedCandidateInfo(selectedCandidateObject) {
    try {
        const electionIdInUrl = window.location.href.split("/");
        let electionId = electionIdInUrl[electionIdInUrl.length - 1]

        console.log(electionIdInUrl);
        console.log(electionId);

        const urlParams = selectedCandidateObject.map(candidate => `id_number=${candidate.id_number}`).join('&');
        const url = `/api/candidate-info?electionId=${electionId}&${urlParams}`

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

async function submitVote(selectedCandidate) {
    try {
        showLoading();
        let urlPath = window.location.href.split('/');
        const electionId = urlPath[urlPath.length - 1]

        const response = await fetch('/api/vote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ selectedCandidate, electionId })
        });

        hideLoader();
        return response;
    } catch (error) {
        console.error(error);
    }
}

// Enhanced checkbox limitation with real-time feedback
document.addEventListener('DOMContentLoaded', () => {
    const senatorSection = document.querySelector('section[data-max-vote]');
    if (senatorSection) {
        senatorSection.addEventListener('change', (event) => {
            if (event.target.matches('input[type="checkbox"]')) {
                limitCheckboxSelection(event.target);
                updateSelectionCounter(event.target);
            }
        });

        // Initialize counter display
        updateSelectionCounter(senatorSection.querySelector('input[type="checkbox"]'));
    }
});

function limitCheckboxSelection(checkboxElement) {
    const section = checkboxElement.closest('section');
    const maxVotes = parseInt(section.dataset.maxVote) || 12;
    const selectedCheckboxes = section.querySelectorAll('input[type="checkbox"]:checked');

    if (checkboxElement.checked && selectedCheckboxes.length > maxVotes) {
        // Prevent exceeding max votes by unchecking the current checkbox
        checkboxElement.checked = false;

        // Show error message
        const positionLabel = section.querySelector('#position-label').textContent.trim();
        const errorContainer = document.getElementById(`error-${positionLabel}`);
        if (errorContainer) {
            errorContainer.textContent = `Maximum ${maxVotes} candidates can be selected for ${positionLabel}.`;
            errorContainer.style.display = 'block';

            // Clear error after 3 seconds
            setTimeout(() => {
                errorContainer.style.display = 'none';
                errorContainer.textContent = '';
            }, 3000);
        }
    }
}

function updateSelectionCounter(checkboxElement) {
    if (!checkboxElement) return;

    const section = checkboxElement.closest('section');
    const maxVotes = parseInt(section.dataset.maxVote) || 12;
    const selectedCount = section.querySelectorAll('input[type="checkbox"]:checked').length;

    // Find or create counter display
    let counterElement = section.querySelector('.selection-counter');
    if (!counterElement) {
        counterElement = document.createElement('div');
        counterElement.className = 'text-sm text-blue-300 selection-counter';

        // Insert after the position label
        const positionLabel = section.querySelector('#position-label');
        if (positionLabel && positionLabel.parentNode) {
            positionLabel.parentNode.insertBefore(counterElement, positionLabel.nextSibling);
        }
    }

    // Update counter text with color coding
    const isExact = selectedCount === maxVotes;
    const isOver = selectedCount > maxVotes;
    const isUnder = selectedCount > 0 && selectedCount < maxVotes;

    let colorClass = 'text-blue-100';
    if (isExact) {
        colorClass = 'text-blue-100 font-semibold';
    }

    counterElement.innerHTML = `Selected: <span class="${colorClass}">${selectedCount}</span> / ${maxVotes} ${isExact ? '✓' : isUnder ? '(need more)' : isOver ? '(too many)' : ''}`;
}
