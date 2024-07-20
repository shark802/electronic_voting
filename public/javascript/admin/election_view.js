import "/javascript/logout.js"
import '/javascript/admin/election_edit.js';
import '/javascript/admin/election_showHide.js';
import '/javascript/admin/election_delete.js';

const election_nav = document.querySelector("#election_nav")
const view_election_page = document.querySelector("#view_election_page")
view_election_page.removeAttribute("href")

election_nav.classList.remove("font-normal")
election_nav.classList.add("active-page")

view_election_page.classList.add("active-nav")
$("#election_subpage").slideDown(500);

// Hide Sidebar
document.querySelector("#show-sidebar").addEventListener("click", () => {
    $("#sidebar").show(100);
});
// Show Sidebar
document.querySelector("#hide-sidebar").addEventListener('click', () => {
    $("#sidebar").hide(100);
});

// Toggle More option
document.querySelectorAll("#more-button").forEach((button) => {

    button.addEventListener('click', (event) => {
        const eventElectionId = event.target.closest("#electionSection").querySelector("#election-card-id").textContent;

        document.querySelectorAll("#more-option").forEach(element => {
            const elementElectionId = element.closest("#electionSection").querySelector("#election-card-id").textContent;

            if(elementElectionId !== eventElectionId) {
                $(element).hide(100);
            } else {
                const parent = $(event.target).parent(); 
                parent.find('#more-option').toggle(100);
            }
        })   
        
    });

});
