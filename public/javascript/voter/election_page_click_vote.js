import { showSwalErrorToast, showSwalSuccessToast, showSwalWarningToast } from "/javascript/helper/sweetAlertFunctions.js";

function parseDateTime(date, time) {
    const parseDate = new Date(date);
    const [hourPart, minutePart] = time.split(':');

    return parseDate.setHours(hourPart, minutePart);
}

document.querySelectorAll("#vote-now-button").forEach(button => {
    button.addEventListener('click', async event => {
        const parentSection = event.target.parentElement;
        const electionId = event.target.closest('section').querySelector("#election-id").textContent;

        const now = new Date();
        const startDate = parseDateTime(parentSection.querySelector("#date-start").value, parentSection.querySelector("#time-start").value);
        const endDate = parseDateTime(parentSection.querySelector("#date-end").value, parentSection.querySelector("#time-end").value);

        if (now >= startDate && now < endDate) {
            handleVoteRequest(electionId);
        } else if (now < startDate) {
            showSwalWarningToast('Voting has not started yet. Please come back later.');
        } else {
            viewElectionResult(electionId);
        }
    });
});

async function handleVoteRequest(electionId) {
    let registerDeviceData = localStorage.getItem('register-device-data');
    if (registerDeviceData) {
        registerDeviceData = JSON.parse(registerDeviceData);
        await fetch('/api/uuid-validation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uuid: registerDeviceData.uuid })
        });
    }
    window.location.href = `/ballot/${electionId}`;
}

function viewElectionResult(electionId) {
    window.location.href = `/result/${electionId}`
}









// import { showSwalErrorToast, showSwalSuccessToast, showSwalWarningToast } from "/javascript/helper/sweetAlertFunctions.js";

// document.querySelectorAll("#vote-now-button").forEach(button => {
//     button.addEventListener('click', async event => {
//         const parentSection = event.target.parentElement;
//         const electionId = event.target.closest('section').querySelector("#election-id").textContent;

//         const present = new Date();

//         let start = new Date(parentSection.querySelector("#date-start").value);
//         const [startHour, startMinute] = parentSection.querySelector("#time-start").value.split(":");
//         start.setHours(startHour, startMinute);

//         let end = new Date(parentSection.querySelector("#date-end").value);
//         const [endHour, endMinute] = parentSection.querySelector("#time-end").value.split(":");
//         end.setHours(endHour, endMinute);

//         if (present >= start && present <= end) {
//             // Request for election ballot to vote
//             let registerDeviceData = localStorage.getItem('register-device-data');

//             if (registerDeviceData) {
//                 registerDeviceData = JSON.parse(registerDeviceData);
//                 await fetch('/api/uuid-validation', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ uuid: registerDeviceData.uuid })
//                 });
//             }

//             window.location.href = `/ballot/${electionId}`;

//         } else if (present < start) {
//             return showSwalWarningToast('Voting has not started yet. Please come back later.')

//         } else if (end < present) {

//             showSwalErrorToast('Voting period is over. You cannot vote anymore.')

//             // fetch the result if election is finished
//             const electionId = parentSection.querySelector("#election-id").textContent;
//             console.log("viewing result ", electionId);
//             return;
//         }
//     })
// })