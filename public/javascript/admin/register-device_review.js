import { confirmAlert, confirmErrorAlert, showSwalSuccessToast } from "/javascript/helper/sweetAlertFunctions.js"
import "/javascript/logout.js"

const register_device_nav = document.querySelector("#register_device_nav")
const review_request = document.querySelector("#review_request")

register_device_nav.classList.remove("font-normal")
register_device_nav.classList.add("active-page")

$("#register_device_subpage").slideDown(500);

review_request.classList.add("active-nav");

// Hide Sidebar
document.querySelector("#show-sidebar").addEventListener("click", () => {
    $("#sidebar").show(100);
});
// Show Sidebar
document.querySelector("#hide-sidebar").addEventListener('click', () => {
    $("#sidebar").hide(100);
});

declineDeviceRegistration();
acceptDeviceRegistration();

function declineDeviceRegistration() {
    document.querySelector("#register-device-table").addEventListener('click', (event) => {
        if (event.target.id !== "decline-request") return

        const rowClicked = event.target.closest('tr');
        const codename = rowClicked.querySelector('#codename').textContent;
        const uuid = rowClicked.querySelector('#uuid').textContent;
        const requestDate = rowClicked.querySelector('#request-date').textContent;

        const declineModal = document.querySelector('#decline-request-modal');
        displayRegistrationRequestInfo(declineModal, codename, uuid, requestDate);

        // initiate to submit request if the decline modal is confirmed.

    })
}

function displayRegistrationRequestInfo(modal, codename, uuid, requestDate) {
    modal.querySelector('#codename').textContent = codename
    modal.querySelector('#uuid').textContent = uuid
    modal.querySelector('#request-date').textContent = requestDate
}

async function submitDeclineToServer(uuid) {
    const response = await fetch(`/api/uuid/${uuid}`, { method: 'DELETE' });
    return response;
}

function acceptDeviceRegistration() {
    document.querySelector("#register-device-table").addEventListener('click', (event) => {
        if (event.target.id !== "accept-request") return;

        const rowClicked = event.target.closest('tr');
        const codename = rowClicked.querySelector('#codename').textContent;
        const uuid = rowClicked.querySelector('#uuid').textContent;
        const requestDate = rowClicked.querySelector('#request-date').textContent;

        const acceptModal = document.querySelector('#accept-request-modal');

        displayRegistrationRequestInfo(acceptModal, codename, uuid, requestDate);
    })
}

document.querySelector('#decline-request-modal').addEventListener('click', async (event) => {
    if (event.target.id !== "confirm-decline") return;

    const uuid = event.target.closest('#decline-request-modal').querySelector('#uuid').textContent;

    try {
        const response = await submitDeclineToServer(uuid);
        const responseObject = await response.json();
        if (!response.ok) {
            return confirmErrorAlert(responseObject.message);
        }

        document.querySelector(`tr[data-uuid="${uuid}"]`).remove();
        return showSwalSuccessToast(responseObject.message);

    } catch (error) {
        console.error(error);
    }
})

document.querySelector('#accept-request-modal').addEventListener('click', async (event) => {
    if (event.target.id !== "confirm-accept") return;

    const uuid = event.target.closest('#accept-request-modal').querySelector('#uuid').textContent;

    try {
        const response = await submitAcceptToServer(uuid);
        const responseObject = await response.json();

        if (!response.ok) return confirmErrorAlert(responseObject.message);

        document.querySelector(`tr[data-uuid="${uuid}"]`).remove();
        return showSwalSuccessToast(responseObject.message);

    } catch (error) {
        console.error(error);
    }

})

async function submitAcceptToServer(uuid) {
    const response = await fetch(`/api/uuid/${uuid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isToRegister: true })
    });

    return response;
}