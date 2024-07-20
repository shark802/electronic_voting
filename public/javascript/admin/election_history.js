import "/javascript/logout.js"

const election_nav = document.querySelector("#election_nav");
const election_history_page = document.querySelector("#election_history_page");
election_history_page.removeAttribute("href")

election_nav.classList.remove("font-normal")
election_nav.classList.add("active-page")

election_history_page.classList.add("active-nav")
$("#election_subpage").show();

// Hide Sidebar
document.querySelector("#show-sidebar").addEventListener("click", () => {
    $("#sidebar").show(100);
});
// Show Sidebar
document.querySelector("#hide-sidebar").addEventListener('click', () => {
    $("#sidebar").hide(100);
});