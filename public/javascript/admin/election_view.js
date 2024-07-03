import '/javascript/admin/election_edit.js';

const election_nav = document.querySelector("#election_nav")
const view_election_page = document.querySelector("#view_election_page")

election_nav.classList.remove("font-normal")
election_nav.classList.add("active-page")

view_election_page.classList.add("active-nav")
$("#election_subpage").slideDown(500)