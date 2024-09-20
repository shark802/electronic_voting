

const voteStatusSelectElement = document.body.querySelector('#voteStatus');
const departmentSelectElement = document.body.querySelector('#department');
const programSelectElement = document.body.querySelector('#program');
const yearLevelSelectElement = document.body.querySelector('#year_level');

if (!departmentSelectElement.value) {
    // disable the select element to choose program if no department is selected
    programSelectElement.disabled = true;
}

departmentSelectElement.addEventListener('input', async (event) => {
    try {
        const newSelectedDepartment = event.target.value;

        if (newSelectedDepartment === '') {
            while (programSelectElement.options.length > 1) {
                programSelectElement.remove(1);  // Remove option at index 1 repeatedly
            }

            programSelectElement.disabled = true;
            return;
        }
        programSelectElement.disabled = false;

        // update optons for programs select
        const newProgramOptions = await fetchDepartmentPograms(newSelectedDepartment);

        while (programSelectElement.options.length > 1) {
            programSelectElement.remove(1);  // Remove option at index 1 repeatedly
        }

        newProgramOptions.forEach(option => {
            const newOption = document.createElement('option');
            newOption.value = option;
            newOption.textContent = option;
            programSelectElement.appendChild(newOption); // append the new program option of new department selected 
        });

    } catch (error) {
        console.log(error.message);
    }

})

async function fetchDepartmentPograms(newSelectedDepartment) {
    const response = await fetch(`/api/program?department=${newSelectedDepartment}`);
    const responseObject = await response.json();
    const departmentProgramList = responseObject.programs;

    return departmentProgramList; // return list of programs under of the selected department
}

