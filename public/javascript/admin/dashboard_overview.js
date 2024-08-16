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

    document.querySelector('#manage-population-modal').showModal();

    displayPopulationInput(event);
    calculateTotalVoterOnInputEvent()

});

// Event listener for submitting update population form
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

        // const electionId = event.target.querySelector('#hidden-election-id').value;
        // console.log(electionId);


    } catch (error) {
        console.error(error);
    }

})

// Event listener for closing the modal
document.querySelector('#manage-population-modal-exit').addEventListener('click', (event) => event.target.closest('dialog').close())


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

function getInputPopulationPerProgram() {
    const populationPerProgramObject = Array.from(document.querySelector('#input-container').querySelectorAll('input[type=number')).reduce((object, currentInput) => {
        const programCode = currentInput.id.trim();
        const programPopulation = currentInput.value.trim();

        if (programPopulation) object[programCode] = programPopulation;

        return object;
    }, {})

    return populationPerProgramObject;
}

function updateElectionOverviewDisplay(electionId, total, populationPerProgramObject) {
    console.log(electionId);
    console.log(total);
    console.log(populationPerProgramObject);
}


