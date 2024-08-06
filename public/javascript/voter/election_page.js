import "/javascript/voter/election_page_click_vote.js";
import { displayRedirectMessage } from "/javascript/helper/showRedirectMessage.js";
import { showSwalSuccessToast } from "/javascript/helper/sweetAlertFunctions.js";

document.querySelectorAll("#vote-now-button").forEach(button => {
   const parentSection = button.parentElement;

   let start = new Date(parentSection.querySelector("#date-start").value);
   const [startHour, startMinute] = parentSection.querySelector("#time-start").value.split(":");
   start.setHours(startHour, startMinute);

   let end = new Date(parentSection.querySelector("#date-end").value);
   const [endHour, endMinute] = parentSection.querySelector("#time-end").value.split(":");
   end.setHours(endHour, endMinute);

   let electiopnStatusMessage = parentSection.querySelector("#election-status-message");
   // console.log(electiopnStatusMessage.textContent);

   displayRedirectMessage();
   displayToast();
   toggleProfile();

   setInterval(() => {
      let present = new Date();

      if (start <= present && end >= present) { // means voting is now available
         electiopnStatusMessage.textContent = "The election is now live! Cast your vote to make your voice heard.";
         electiopnStatusMessage.style.color = "#3b82f6";

         button.style.backgroundColor = '#3b82f6';
         button.style.color = "white"
      }

      if (present > end) { // means voting is finiished
         electiopnStatusMessage.textContent = "The election has ended. You can now view the results.";

         button.textContent = "View Result"
         button.style.backgroundColor = "#22c55e";
         button.style.color = "white"
      }

   }, 1000);

});

function displayToast() {
   const urlQueryParams = new URLSearchParams(window.location.search);
   const isVoted = urlQueryParams.get("isVoted");
   if (isVoted === 'true') {
      showSwalSuccessToast("Thank you for participating");
   }
}


function toggleProfile() {
   document.querySelector('#profile-info').addEventListener('click', (event) => {
      $("#account-section").slideToggle(300);
   })
}