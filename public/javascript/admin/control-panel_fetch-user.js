const control_panel_nav = document.querySelector("#control_panel_nav");
const fetch_user = document.querySelector("#fetch_user")

control_panel_nav.classList.remove("font-normal")
control_panel_nav.classList.add("active-page")

$("#control_panel_subpage").slideDown(500);

fetch_user.classList.add("active-nav");

// Hide Sidebar
document.querySelector("#show-sidebar").addEventListener("click", () => {
    $("#sidebar").show(100);
});
// Show Sidebar
document.querySelector("#hide-sidebar").addEventListener('click', () => {
    $("#sidebar").hide(100);
});
