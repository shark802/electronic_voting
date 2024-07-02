import { isValidStartDate, isValidEndDate } from "/javascript/formInputValidator/dateValidator.js"
import { isValidText } from "/javascript/formInputValidator/isValidText.js";
import { isValidEndTime } from "/javascript/formInputValidator/timeValidator.js";
import { changeEventListener } from "/javascript/helper/changeEventListener.js";

// Style active navbar
const election_nav = document.querySelector("#election_nav");
const create_election_page = document.querySelector("#create_election_page");

election_nav.classList.remove("font-normal")
election_nav.classList.add("active-page")

create_election_page.classList.add("active-nav")
$("#election_subpage").show()

// Process create election form
// HTMLInputElement
const election_name = document.querySelector("#election_name")
const date_start = document.querySelector("#date_start")
const time_start = document.querySelector("#time_start")
const date_end = document.querySelector("#date_end")
const time_end = document.querySelector("#time_end")

// Div element to display error message
const election_name_error_message = document.querySelector("#election_name_error_message")
const startDateErrorMessage = document.querySelector("#startdate_error_message")
const endDateErrorMessage = document.querySelector("#enddate_error_message")
const endTimeErrorMessage = document.querySelector("#endTime_error_message")

changeEventListener([election_name], isValidText, election_name_error_message) // Validate the election name if user change focus from input
changeEventListener([date_start], isValidStartDate,  startDateErrorMessage); // Validate the start date input 
changeEventListener([date_end, date_start], isValidEndDate, endDateErrorMessage); // Validate the end date input
changeEventListener([time_end, time_start], isValidEndTime, endTimeErrorMessage)

// validate every input before sending to server
document.querySelector("#create_election_form").addEventListener("submit", async(event) => {
    event.preventDefault();

    if(
        !isValidText([election_name], isValidText, election_name_error_message) ||
        !isValidStartDate([date_start], isValidStartDate,  startDateErrorMessage) ||
        !isValidEndDate([date_end, date_start], isValidEndDate, endDateErrorMessage)) 
    {
        console.log("Form Not Valid")
        return;
    }else {
        try {
            
            const response = await fetch('/api/elections', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ 
                    election_name: election_name.value, 
                    date_start: date_start.value, 
                    time_start: time_start.value, 
                    date_end: date_end.value, 
                    time_end: time_end.value
                 })
            })
            
            if (response.ok) {
                const message = await response.json();
                Swal.fire({
                    title: "Success!",
                    text: message.message,
                    icon: "success"
                });
                document.querySelector("#create_election_form").reset();
                // Swal.fire({
                //     position: "top",
                //     icon: "success",
                //     title: message.message,
                //     showConfirmButton: false,
                //     timer: 1500
                // });
                
            }else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                    footer: '<a href="#">Why do I have this issue?</a>'
                });
            }
        } catch (error) {
            console.error(error);
        }
    }
    
})