import { displayRedirectMessage } from "/javascript/helper/showRedirectMessage.js";
import { isValidText } from "/javascript/formInputValidator/isValidText.js"
import "/javascript/landing-page-login.js";
import { showSwalSuccessToast, showSwalErrorToast, confirmErrorAlert, confirmAlert } from '/javascript/helper/sweetAlertFunctions.js';

const loginModal = document.querySelector('#login-modal');

document.querySelector('#login-button').addEventListener('click', () => {
    loginModal.showModal();
});

document.querySelector("#login-modal-exit").addEventListener('click', function (event) {
    loginModal.close();
});

displayRedirectMessage();
openRegisterDeviceModal();
closeRegisterDeviceModal();
submitRegisterDeviceForm();

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

            if (!response.ok) {
                const action = await confirmErrorAlert(responseObject.message);
                if (action.isConfirmed) {
                    document.querySelector('#registerDeviceModal').showModal();
                }
                return;
            }

            const action = await confirmAlert("Registration send", "Your request is now pending for approval");
            if (action.isConfirmed) {
                document.querySelector('#registerDeviceModal').showModal();
            }
        } catch (error) {
            console.log(error.message);
        }
    });
}

async function fetchUuid(codeName) {
    document.querySelector('#registerDeviceModal').close();
    const response = await fetch('/api/uuid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeName })
    });

    return response;
};


