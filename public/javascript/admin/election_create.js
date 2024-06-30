import { isValidStartDate } from "/javascript/formInputValidator/isValidStartDate.js"
import { isValidEndDate } from "/javascript/formInputValidator/isValidEndDate.js";
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
document.querySelector("#create_election_form").addEventListener("submit", (event) => {
    event.preventDefault();

    if(
        !isValidText([election_name.value], election_name_error_message) &&
        !isValidStartDate([date_start.value], startDateErrorMessage) && 
        !isValidEndtDate([date_end.value, date_start.value], endDateErrorMessage)) 
    {
        console.log("Form Not Valid")
        return
    }else {
        console.log("submit to server")
    }
    
})