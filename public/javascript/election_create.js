
// Style active navbar
const election_nav = document.querySelector("#election_nav")
const create_election_page = document.querySelector("#create_election_page")

election_nav.classList.remove("font-normal")
election_nav.classList.add("active-page")

create_election_page.classList.add("active-nav")
$("#election_subpage").show()


// Process create election form
const election_name = document.querySelector("#election_name")
const date_start = document.querySelector("#date_start")
const time_start = document.querySelector("#time_start")
const date_end = document.querySelector("#date_end")
const time_end = document.querySelector("#tim_end")

document.querySelector("#create_election_form").addEventListener("submit", (event) => {
    event.preventDefault();
    
})