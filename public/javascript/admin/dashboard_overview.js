import { confirmErrorAlert, confirmAlert, showSwalSuccessToast } from "/javascript/helper/sweetAlertFunctions.js"
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


// Event listener for opening update population form
document.querySelector('#overview-container').addEventListener('click', (event) => {
    if (event.target.id !== 'manage') return;

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
        document.querySelector('#close-election').showModal();

        document.querySelector('#close-election-button').addEventListener('click', async () => {
            document.querySelector('#close-election').close();

            const action = await confirmAlert('Are you sure you want to close the election dashboard?')
            if (!action.isConfirmed) return document.querySelector('#close-election').showModal();

            try {
                const response = await putRequestToCloseElection(electionId);
                const responseObject = await response.json();

                if (!response.ok) {
                    return confirmErrorAlert(responseObject.message);
                }

                electionContainerSection.remove();
                return showSwalSuccessToast(responseObject.message);
            } catch (error) {
                console.log(error);
            }

        })
    } else {

        document.querySelector('#manage-population-modal').showModal();

        displayPopulationInput(event);
        displayTotalPopulationOnModal(getInputPopulationPerProgram());
        calculateTotalVoterOnInputEvent();
        listenForFormSubmitEvent();
    }
});

function listenForFormSubmitEvent() {
    document.querySelector('#manage-election-population').addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
            if (Object.entries(getInputPopulationPerProgram()).length < 1) return; // return when nothing inputted.

            document.querySelector('#manage-population-modal').close();
            const action = await confirmAlert('Confirm submission');
            if (!action.isConfirmed) return document.querySelector('#manage-population-modal').showModal(); // return if not confirmed submission.

            const response = await submitUpdateVoterPopulationForm();
            const responseObject = await response.json();

            if (!response.ok) return confirmErrorAlert(responseObject.message);

            showSwalSuccessToast(responseObject.message);


            // update election overview display

            const electionId = event.target.querySelector('#hidden-election-id').value;
            const populationPerProgramObject = getInputPopulationPerProgram();

            updateElectionOverviewDisplay(electionId, populationPerProgramObject);

        } catch (error) {
            console.error(error);
        }

    })
}

// Event listener for closing the modal
document.querySelector('#close-modal').addEventListener('click', (event) => event.target.closest('dialog').close())
document.querySelector('#exit-close-election-modal').addEventListener('click', (event) => event.target.closest('dialog').close());

// construct the input element for each program to insert population data
function displayPopulationInput(event) {
    const electionId = event.target.closest('section').querySelector('#election-id').textContent;
    const programList = event.target.closest('section').querySelectorAll('#program');

    document.querySelector('#manage-election-population').querySelector('#hidden-election-id').value = electionId;

    const input = Array.from(programList).map(element => {
        const programCode = element.querySelector('#program-code').textContent.trim();
        const programPopulationDiv = element.querySelector('#program-population').textContent.trim();
        const programPopulationInput = programPopulationDiv == 'N/A' ? `<input type="number" id=${programCode} class="py-1 pl-3 font-normal border border-gray-400 rounded-md focus:outline-blue-500">` : `<input type="number" value=${programPopulationDiv} id=${programCode} class="py-1 pl-3 font-normal border border-gray-400 rounded-md focus:outline-blue-500">`;

        return `
            <div class="my-2">
                <label for=${programCode} class="w-1/3 inline-block text-sm font-medium">${programCode}</label>
                ${programPopulationInput}
            </div>
        `
    }).join(' ');

    document.querySelector('#manage-election-population').querySelector('#input-container').innerHTML = input;

}

function displayTotalPopulationOnModal(populationPerProgramObject) {
    const totalPopulation = Object.values(populationPerProgramObject).reduce((total, currentProgramPopulation) => total + Number(currentProgramPopulation), 0);
    document.querySelector('#manage-population-modal').querySelector('#total-voter').value = totalPopulation;
}

function calculateTotalVoterOnInputEvent() {
    const form = document.querySelector('#manage-election-population');

    form.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', () => {
            const total = Array.from(form.querySelectorAll('input[type="number"]')).reduce((total, currentInput) => total + Number(currentInput.value), 0);

            form.querySelector('#total-voter').value = total;
        });
    });
}

async function submitUpdateVoterPopulationForm() {
    const populationPerProgram = getInputPopulationPerProgram();
    const total = document.querySelector('#total-voter').value.trim();
    const electionId = document.querySelector('#hidden-election-id').value.trim();

    const response = await fetch(`/api/population/${electionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total, populationPerProgram })
    });

    return response;

}

// return an object containing
function getInputPopulationPerProgram() {
    const populationPerProgramObject = Array.from(document.querySelector('#input-container').querySelectorAll('input[type=number')).reduce((object, currentInput) => {
        const programCode = currentInput.id.trim();
        const programPopulation = currentInput.value.trim();

        if (programPopulation) object[programCode] = programPopulation;

        return object;
    }, {})

    return populationPerProgramObject;
}

function updateElectionOverviewDisplay(electionId, populationPerProgramObject) {
    const electionSection = document.querySelector(`section[data-election-id="${electionId.trim()}"]`);

    if (!electionSection) return;

    const totalPopulation = Object.values(populationPerProgramObject).reduce((total, population) => total + Number(population), 0);

    electionSection.querySelectorAll('#program').forEach(program => {
        const programCode = program.querySelector('#program-code').textContent.trim();
        const programPopulation = populationPerProgramObject[programCode];

        if (programPopulation !== undefined) {
            program.querySelector('#program-population').textContent = programPopulation;
        }
    });

    electionSection.querySelector('#total-population').textContent = totalPopulation;
}

async function putRequestToCloseElection(electionId) {
    const result = await fetch(`/api/election-overview/${electionId}`, {
        method: 'PUT',
    })
    return result;
}


