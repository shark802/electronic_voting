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

// function toggleElectionOverview(event) {
//     if (!event.target.closest('#program')) $(event.target.closest('#program')).slideToggle(300);
// }


document.querySelector('#overview-container').addEventListener('click', (event) => {
    if (event.target.id !== 'manage') return;

    displayPopulationInput(event);
    calculateTotalVoterOnInputEvent()

})

function displayPopulationInput(event) {
    const electionId = event.target.closest('section').querySelector('#election-id').textContent;
    const programList = event.target.closest('section').querySelectorAll('#program');

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

// function calculateTotalVoterOnInputEvent() {
//     const form = document.querySelector('#manage-election-population');

//     form.querySelectorAll('input[type="number"]').forEach(input => {
//         input.addEventListener('input', () => {
//             const total = Array.from(form.querySelectorAll('input[type="number"]'))
//                 .reduce((total, currentInput) => total + Number(currentInput.value), 0);
//             console.log(total);

//             form.querySelector('#total-voter').value = total;
//         });
//     });
// }


function calculateTotalVoterOnInputEvent() {
    const form = document.querySelector('#manage-election-population');

    form.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', () => {
            const total = Array.from(form.querySelectorAll('input[type="number"]')).reduce((total, currentInput) => total + Number(currentInput.value), 0);

            // console.log(total);
            form.querySelector('#total-voter').value = total;
        });
    });
}


