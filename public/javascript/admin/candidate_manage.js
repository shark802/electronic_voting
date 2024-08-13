// import { setTimeout } from "timers/promises";
import "/javascript/logout.js";
import { isInputNotEmpty } from '/javascript/formInputValidator/isInputNotEmpty.js'
import { confirmAlert, showSwalSuccessToast, showSwalErrorToast } from "/javascript/helper/sweetAlertFunctions.js";

const candidate_nav = document.querySelector("#candidate_nav");
const manage_candidate = document.querySelector("#manage_candidate");

candidate_nav.classList.remove("font-normal");
candidate_nav.classList.add("active-page");

$("#candidate_subpage").slideDown(500);

manage_candidate.classList.add("active-nav");

// Hide Sidebar
document.querySelector("#show-sidebar").addEventListener("click", () => {
    $("#sidebar").show(100);
});
// Show Sidebar
document.querySelector("#hide-sidebar").addEventListener('click', () => {
    $("#sidebar").hide(100);
});

main();

function main() {
    toggleDisplayCandidate(); // Toggle the candidate table to display for management
    displayInitialCandidate(); //  Will display the initial candidates(President position)
    displayCandidatesForPositionClick(); // Will update the candidate table if click new candidate position
    triggerOptionOrEdit(); // Will open the more option or edit if tey are click
    closeOptions() // Will close opened options if click is outside the options
    updateCandidateStatus();
}

function toggleDisplayCandidate() {
    document.querySelectorAll("#election").forEach(election => {
        election.addEventListener('click', event => {
            if (!event.target.closest("#candidates-display")) {
                $(event.target.closest("#election").querySelector("#candidates-display")).slideToggle(300);
            }
        })
    });
}

function displayInitialCandidate() {
    document.addEventListener('DOMContentLoaded', async () => {
        document.querySelector("#position").classList.remove("text-gray-400");
        document.querySelector("#position").classList.add("selected-position"); // set as default position selected

        const candidates = await fetchCandidates(document.querySelector("#position").textContent);
        displayFetchCandidate(candidates);
    })
}

function displayCandidatesForPositionClick() {
    document.querySelectorAll("#position").forEach(position => {
        position.addEventListener('click', async (event) => {
            styleSelectedPosition(event);

            const candidates = await fetchCandidates(position.textContent);
            displayFetchCandidate(candidates);
        });
    });
}

function triggerOptionOrEdit() {
    document.querySelectorAll("#candidates-section").forEach(section => { // Open more option
        section.addEventListener('click', async (event) => {
            if (event.target.closest('#option-section')) {
                toggleMoreOptionDisplay(event);
            }

            if (event.target.closest("#edit")) {
                await editCandidate(event);
            }

            if (event.target.closest("#delete_candidate")) {
                await deleteCandidate(event);
            }

        })
    });
}

function closeOptions() {
    document.addEventListener('click', event => { // Close if there is an open section  
        if (!event.target.closest("#option-section")) {
            document.querySelectorAll("#candidates-section").forEach(candidateSection => {
                candidateSection.querySelectorAll("#more-option").forEach(section => $(section).slideUp(100))
            })
        }
    })
}

function updateCandidateStatus() {
    document.querySelectorAll("#candidates-section").forEach(candidateSection => {
        candidateSection.addEventListener('click', async (event) => {

            const status = String(event.target.closest('tr').querySelector('td[data-status]').dataset.status == 1 ? 0 : 1);
            const candidate_id = event.target.closest('tr').dataset.candidateId;

            if (event.target.closest("#toggleCandidateStatus")) {
                const action = await confirmAlert("Confirm Update", "Please confirm your action to update the candidate status")
                if (!action.isConfirmed) return;

                const response = await fetch(`/api/candidate/status/${candidate_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: status })
                });

                const responseObject = await response.json()
                if (!response.ok) {
                    showSwalErrorToast(responseObject.message)
                    return;
                }
                changeUpdateStatusIcon(status, event); // change active/inactive diplay state
                toggleStatusOptionDisplay(event); // will update the option icon activate/deactivate
                event.target.closest('tr').querySelector('td[data-status]').dataset.status = status;

                showSwalSuccessToast(responseObject.message);
                return;
            }
        })
    })
}

async function deleteCandidate(event) {
    const candidateId = event.target.closest('tr').dataset.candidateId;

    const action = await confirmAlert("Are you sure you want to delete this candidate?");
    if (!action.isConfirmed) return;

    const response = await fetch(`/api/candidate/${candidateId}`, { method: 'DELETE' });
    const responseObject = await response.json();
    if (!response.ok) {
        showSwalErrorToast(responseObject.message)
        return;
    }

    showSwalSuccessToast(responseObject.message);
    event.target.closest('tr').remove();
    return;
}

async function editCandidate(event) {
    const candidateId = event.target.closest('tr').dataset.candidateId;

    await displayEditForm(event);
    await confirmCandidateUpdate(candidateId);
}


// HELPER FUNCTIONS
function styleSelectedPosition(event) {
    document.querySelectorAll("#position").forEach(pos => {
        pos.classList.remove("selected-position");
        pos.classList.add("text-gray-400");
    });

    event.target.classList.remove("text-gray-400");
    event.target.classList.add("selected-position");
}

async function fetchCandidates(position) {
    try {
        const electionsQueryParameter = Array.from(document.querySelectorAll("#election")).map(election => {
            const electionId = election.querySelector("#election-id").textContent.trim();
            return `election_id=${electionId}`;
        }).join("&");

        const url = `/api/candidate?position=${position}&${electionsQueryParameter}`

        const response = await fetch(url);
        if (response.ok) {
            const responseObject = await response.json();
            return responseObject;
        }
    } catch (error) {
        console.error(error);
    }
}

function displayFetchCandidate(candidates) {
    document.querySelectorAll("tbody").forEach(content => {
        content.innerHTML = "";
    })

    candidates.forEach(candidate => {

        const status = candidate.enabled === 1 ? '<div class="active">ACTIVE</div>' : '<div class="inactive">INACTIVE</div>';
        let statusOptionDisplay
        if (candidate.enabled === 0) {
            statusOptionDisplay = `
            <div id="toggleCandidateStatus" class="flex items-center px-3 my-2 transition-all rounded-sm hover:bg-blue-200">
                <img id="viewStatusImage" src="/img/view.webp" alt="view" class="w-4 h-4">
                <p id="viewStatus" class="ml-2">Activate</p>
            </div>
            `
        } else {
            statusOptionDisplay = `
            <div id="toggleCandidateStatus" class="flex items-center px-3 my-2 transition-all rounded-sm hover:bg-blue-200">
                <img id="viewStatusImage" src="/img/hide.webp" alt="hide" class="w-4 h-4">
                <p id="viewStatus" class="ml-2">Deactivate</p>
            </div>
            `
        }
        let candidateAddedAt = new Date(candidate.added_at);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };

        candidateAddedAt = candidateAddedAt.toLocaleString('en-US', options);

        const tableRow = `
            <tr data-candidate-id="${candidate.candidate_id}" class="rounded-xl transition-all tablerow">
                <td class="text-xs font-medium py-2 pl-2 text-gray-60 rounded-tl-lg rounded-bl-lg text-center">${candidate.id_number}</td>
                <td class="text-xs font-medium py-2 pl-4 text-gray-600">${candidate.lastname}, ${candidate.firstname}</td>
                <td class="text-xs pl-4 font-medium py-2 text-gray-600">${candidate.alias}</td>
                <td class="text-xs font-medium py-2 pl-2 text-gray-600">${candidate.course}</td>
                <td class="text-xs font-medium py-2 pl-2 text-gray-600">${candidateAddedAt}</td>
                <td data-status="${candidate.enabled}" class="text-xs font-medium py-2 pl-2 text-gray-60 text-center">${status}</td>
                <td class="rounded-tr-lg rounded-br-lg">
                    <div class="flex justify-center gap-4 items-center z-30">
                        <div id="option-section" class="relative">
                            <img src="/img/more.webp" class="w-5 hover:cursor-pointer opacity-70 hover:rounded-full hover:bg-blue-300"/>
                            <div id="more-option" class="absolute z-10 right-0 gap-2 px-1 py-3 hidden bg-white border border-solid rounded shadow-md w-36 h-fit top-7">

                               ${statusOptionDisplay}

                                <div id="delete_candidate" class="flex items-center px-3 my-2 transition-all rounded-sm hover:bg-blue-200">
                                    <img src="/img/trash.webp" alt="delete" class="w-4 h-4">
                                    <p class="ml-2">Delete</p>
                                </div>

                            </div>
                        </div> 
                        <p id="edit" class="font-semibold hover:cursor-pointer text-blue-500">Edit</p>
                    </div> 
                </td>
            </tr>
        `
        document.querySelector(`tbody[data-election-id="${candidate.election_id}"]`).innerHTML += tableRow;
    })
}

function toggleMoreOptionDisplay(event) {

    document.querySelectorAll("#candidates-section").forEach(section => { // Close other more option if there is opened before opening new option
        section.querySelectorAll("#more-option").forEach(option => {
            if (option !== event.target.closest("#option-section").querySelector("#more-option")) {
                $(option).slideUp(100);
            }
        })
    });

    if (event.target.closest("#more-option")) return;
    $(event.target.closest("#option-section").querySelector("#more-option")).slideToggle(300)
}

function changeUpdateStatusIcon(status, event) {
    const statusWord = event.target.closest('tr').querySelector('td[data-status]').querySelector('div');
    const newStatus = status == 1 ? 'ACTIVE' : 'INACTIVE';
    if (Number(status) === 1) {
        statusWord.textContent = newStatus;
        event.target.closest('tr').querySelector('td[data-status]').querySelector('div').classList.remove('inactive');
        event.target.closest('tr').querySelector('td[data-status]').querySelector('div').classList.add('active');
    } else {
        statusWord.textContent = newStatus;
        event.target.closest('tr').querySelector('td[data-status]').querySelector('div').classList.remove('active');
        event.target.closest('tr').querySelector('td[data-status]').querySelector('div').classList.add('inactive');
    }
}

function toggleStatusOptionDisplay(event) {
    const prevStatus = event.target.closest("#toggleCandidateStatus").querySelector("#viewStatus");
    if (prevStatus.textContent == 'Activate') {
        prevStatus.textContent = "Deactivate";
        event.target.closest("#candidates-section").querySelector("#viewStatusImage").src = "/img/hide.webp"
    } else {
        prevStatus.textContent = "Activate";
        event.target.closest("#candidates-section").querySelector("#viewStatusImage").src = "/img/view.webp"
    }

}

async function displayEditForm(event) {
    const dialog = document.querySelector('dialog');

    try {
        const candidateId = event.target.closest('tr[data-candidate-id]').dataset.candidateId;

        const response = await fetch(`/api/candidate/${candidateId}`);
        const responseObject = await response.json();

        dialog.querySelector('#fullname').textContent = `Fullname:  ${responseObject.lastname}, ${responseObject.firstname}`;
        dialog.querySelector('#id-number').textContent = `ID:  ${responseObject.id_number}`;
        dialog.querySelector('#course').textContent = `Course:  ${responseObject.course}`;

        dialog.querySelector("#alias").value = responseObject.alias;
        dialog.querySelector("#party").value = responseObject.party;
        const positionOptions = dialog.querySelector("#selectPosition").querySelectorAll('option');
        for (let option of positionOptions) {
            if (option.value === responseObject.position) {
                option.selected = true;
                break;
            }
        }

    } catch (error) {
        console.error(error);
    }

    document.querySelector("dialog").showModal();

    // Close modal
    document.querySelector("#closeModal").addEventListener('click', (event) => {
        event.target.closest('dialog').close()
    })
}

async function confirmCandidateUpdate(candidateId) {
    try {
        document.querySelector("#editCandidateForm").addEventListener('submit', async (event) => {
            event.preventDefault();
            document.querySelector('dialog').close();

            if (!validateFormBeforeSubmit(event)) {
                showSwalErrorToast('Update failed, Please check the form before you submit');
                return;
            }

            const action = await confirmAlert("Confirm Update", "Please confirm to update the candidate");

            if (!action.isConfirmed) return;

            const position = event.target.querySelector('#selectPosition').value;
            const alias = event.target.querySelector('#alias').value;
            const party = event.target.querySelector('#party').value;

            const response = await fetch(`/api/candidate/${candidateId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ position, alias, party })
            });
            const responseObject = await response.json();
            if (!response.ok) {
                showSwalErrorToast(responseObject.message);
                return;
            }

            showSwalSuccessToast(responseObject.message);

            const candidates = await fetchCandidates(document.querySelector(".selected-position").textContent);
            displayFetchCandidate(candidates);
            return;

        })

    } catch (error) {
        console.error(error);
    }
}

function validateFormBeforeSubmit(event) {
    const positionInput = event.target.querySelector("#selectPosition");
    const aliasInput = event.target.querySelector("#alias");
    const partyInput = event.target.querySelector("#party");

    const positionErrorMessage = event.target.querySelector("#positionErrorMessage")
    const aliasErrorMessage = event.target.querySelector("#aliasErrorMessage")
    const partyErrorMessage = event.target.querySelector("#partyErrorMessage")
    if (
        !isInputNotEmpty([positionInput], positionErrorMessage) ||
        !isInputNotEmpty([aliasInput], aliasErrorMessage) ||
        !isInputNotEmpty([partyInput], partyErrorMessage)
    ) {
        return false;
    }
    return true;
}