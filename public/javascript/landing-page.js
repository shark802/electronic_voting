import { displayRedirectMessage } from "/javascript/helper/showRedirectMessage.js";
import { isValidText } from "/javascript/formInputValidator/isValidText.js"
import "/javascript/landing-page-login.js";
import { showSwalSuccessToast, showSwalErrorToast, confirmErrorAlert, confirmAlert } from '/javascript/helper/sweetAlertFunctions.js';
import { showLoading, hideLoader } from "/javascript/helper/loader.js"

const loginModal = document.querySelector('#login-modal');

document.querySelector('#login-button').addEventListener('click', () => {
    loginModal.showModal();
});

document.querySelector("#login-modal-exit").addEventListener('click', function (event) {
    loginModal.close();
});

displayRedirectMessage();
displayUuidOnLoad();
openRegisterDeviceModal();
closeRegisterDeviceModal();
submitRegisterDeviceForm();

function displayUuidOnLoad() {
    document.addEventListener('DOMContentLoaded', () => {
        displayUUID();
    })
}

function openRegisterDeviceModal() {
    document.querySelector('#register-device-button').addEventListener('click', () => {
        document.querySelector('#registerDeviceModal').showModal();
    })
}

function closeRegisterDeviceModal() {
    document.querySelector('#closeRegisterDevice').addEventListener('click', () => {
        document.querySelector('#registerDeviceModal').close();
    })
}

function submitRegisterDeviceForm() {
    document.querySelector('#registerDeviceForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const codeName = document.querySelector('#code-name');
        const codeNameErrorMessage = document.querySelector('#codeNameErrorMessage');

        if (!isValidText([codeName], codeNameErrorMessage)) return;

        try {

            const response = await fetchUuid(codeName.value) // send codename to server to get uuid as response
            const responseObject = await response.json();
            hideLoader();

            if (!response.ok) {
                const action = await confirmErrorAlert(responseObject.message);
                if (action.isConfirmed) {
                    document.querySelector('#registerDeviceModal').showModal();
                }
                return;
            }

            setUuidToLocalStorage(responseObject);
            displayUUID();

            const action = await confirmAlert("Registration send", "Your request is now pending for approval");
            if (action.isConfirmed) {
                document.querySelector('#registerDeviceModal').showModal();
            }
        } catch (error) {
            console.log(error);
        }
    });
}

async function fetchUuid(codeName) {
    document.querySelector('#registerDeviceModal').close();
    showLoading();

    const response = await fetch('/api/uuid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeName })
    });

    return response;
}

function setUuidToLocalStorage(registerResponseObject) {
    if (!registerResponseObject || typeof registerResponseObject !== 'object') return showSwalErrorToast('Cannot set response');

    const objectToStore = JSON.stringify(registerResponseObject);

    try {
        if (!localStorage.getItem('register-device-data')) {
            return localStorage.setItem('register-device-data', objectToStore);
        }
    } catch (error) {
        console.error('Failed to set data in localStorage:', error);
        return showSwalErrorToast('Failed to store data');
    }
}

function displayUUID() {
    const storedRegisterDeviceData = localStorage.getItem('register-device-data');
    const registerDeviceData = JSON.parse(storedRegisterDeviceData);

    const statusMessage = registerDeviceData.status === 'pending' ? "Registration Pending" : "Device registered";

    const registerDeviceForm = document.querySelector('#registerDeviceForm');

    // Set the title depending on status
    registerDeviceForm.closest('dialog').querySelector('h2').textContent = statusMessage;

    // Remove the submit button
    const submitButton = registerDeviceForm.querySelector('input[type="submit"]');
    if (submitButton) {
        submitButton.remove();
    }

    // Set the code name field value and disable it
    const codeNameInput = registerDeviceForm.querySelector('#code-name');
    if (codeNameInput) {
        codeNameInput.value = registerDeviceData.codeName;
        codeNameInput.setAttribute('disabled', 'disabled');
    }

    // Add the UUID field
    const uuidInnerHtmlToDisplay = `
    <div class="">
        <label for="uuid" class="font-medium text-gray-800">UUID</label>
        <input id="uuid" type="text" value="${registerDeviceData.uuid}" disabled placeholder="Request UUID" readonly class="w-full py-1 pl-3 mb-6 font-normal border border-gray-400 rounded-md focus:outline-blue-500">
    </div>
    `;
    registerDeviceForm.insertAdjacentHTML('beforeend', uuidInnerHtmlToDisplay);
}
