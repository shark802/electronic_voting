import { isValidStartDate, isValidEndDate } from "/javascript/formInputValidator/dateValidator.js"
import { isValidText } from "/javascript/formInputValidator/isValidText.js";
import { isValidEndTime } from "/javascript/formInputValidator/timeValidator.js";
import { changeEventListener } from "/javascript/helper/changeEventListener.js";

const electionCardEditButons = document.querySelectorAll('#election-edit-button');

electionCardEditButons.forEach(cardButton => {
    cardButton.addEventListener('click', async (event) => {
        const parent = event.target.parentNode;

        $(event.target.closest("#more-option")).hide(100); 

        const electionId = parent.closest("#electionSection").querySelector("#election-card-id").textContent;
        
        if (electionId) {
            const response = await fetch(`/api/elections/${electionId}`);

            if (response.ok) {
                const responseObject = await response.json();
                const election = responseObject.election;

                function extractDate(date) {
                    const parsedDate = new Date(date);
                    const year = parsedDate.getUTCFullYear();
                    const month = String(parsedDate.getUTCMonth() + 1).padStart(2, '0');
                    const day = String(parsedDate.getUTCDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`; 
                }

                election.date_start = extractDate(election.date_start);
                election.date_end = extractDate(election.date_end);

                document.querySelector("#election_id").textContent = election.election_id;
                document.querySelector("#election_name").value = election.election_name;
                document.querySelector("#date_start").value = election.date_start;
                document.querySelector("#time_start").value = election.time_start;
                document.querySelector("#date_end").value = election.date_end;
                document.querySelector("#time_end").value = election.time_end;

                const modal = document.querySelector("#election-edit-modal");
                modal.showModal(500);

                const closeButton = document.getElementById("closeModal");
                closeButton.addEventListener('click', () => {
                    modal.close();
                })

                const updateForm = document.querySelector("#update_election_form");
                updateForm.addEventListener("submit", updateElection);
            }
        }
    })
})

async function updateElection(event) {
    try {
        event.preventDefault();
        const electionID = document.querySelector("#election_id");
        const electionName = document.querySelector("#election_name");
        const dateStart = document.querySelector("#date_start");
        const timeStart = document.querySelector("#time_start");
        const dateEnd = document.querySelector("#date_end");
        const timeEnd = document.querySelector("#time_end");

        // Div element to display error message
        const election_name_error_message = document.querySelector("#election_name_error_message");
        const startDateErrorMessage = document.querySelector("#startdate_error_message");
        const endDateErrorMessage = document.querySelector("#enddate_error_message");
        const endTimeErrorMessage = document.querySelector("#endTime_error_message");

        if (
            !isValidText([electionName], isValidText, election_name_error_message) ||
            !isValidStartDate([dateStart], isValidStartDate,  startDateErrorMessage) ||
            !isValidEndDate([dateEnd, dateStart], isValidEndDate, endDateErrorMessage)
        ) {
            console.log("Form Not Valid")
            return;
        } else {
            const updateResponse = await fetch(`/api/elections/${electionID.textContent}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    election_name: electionName.value,
                    date_start: dateStart.value,
                    time_start: timeStart.value,
                    date_end: dateEnd.value,
                    time_end: timeEnd.value 
                })
            });

            if (updateResponse.ok) {
                document.querySelector("#election-edit-modal").close();
                Swal.fire({
                    title: "Success!",
                    text: "Update complete",
                    icon: "success"
                });
            }
        }

    } catch (error) {
        console.error(error);
    }
}