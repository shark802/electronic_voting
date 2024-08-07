import { displayRedirectMessage } from "/javascript/helper/showRedirectMessage.js";
import { isValidText } from "/javascript/formInputValidator/isValidText.js"
import "/javascript/landing-page-login.js";

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
    document.querySelector('#registerDeviceForm').addEventListener('submit', (event) => {
        event.preventDefault();

        const codeName = document.querySelector('#code-name');
        const codeNameErrorMessage = document.querySelector('#codeNameErrorMessage');

        if (!isValidText([codeName], codeNameErrorMessage)) return;

        console.log('valid');

    });
}
