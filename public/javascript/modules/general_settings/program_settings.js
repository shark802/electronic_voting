import { showSwalSuccessToast, showSwalErrorToast, confirmAlert } from "/javascript/helper/sweetAlertFunctions.js";

const programDepartmentSelect = document.getElementById('program-department');
const programInput = document.getElementById('program');

export function initializeProgramForm() {
    document.getElementById('program-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const departmentId = programDepartmentSelect.value;
        const programCode = programInput.value;

        if (!departmentId || departmentId === "") {
            programDepartmentSelect.classList.remove('border-gray-300');
            programDepartmentSelect.classList.add('border-red-500');
            return;
        }

        if (!programCode || programCode === "") {
            programInput.classList.remove('border-gray-300');
            programInput.classList.add('border-red-500');
            return;
        }

        try {
            const response = await fetch('/api/program', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ departmentId, programCode })
            });

            const responseObject = await response.json();

            if (!response.ok) {
                showSwalErrorToast(responseObject.message);
                return;
            }

            showSwalSuccessToast(responseObject.message);

            event.target.reset();

        } catch (error) {
            showSwalErrorToast('An error occurred while adding the program.');
        }

    });
}

// remove the border red when the user input something
programDepartmentSelect.addEventListener('input', () => {
    programDepartmentSelect.classList.remove('border-red-500');
    programDepartmentSelect.classList.add('border-gray-300');
});

programInput.addEventListener('input', () => {
    programInput.classList.remove('border-red-500');
    programInput.classList.add('border-gray-300');
});

export function showAllPrograms() {
    document.getElementById('show-all-programs').addEventListener('click', async () => {
        const response = await fetch('/api/program');
        const programs = await response.json();
        console.log(programs);
    });
}


