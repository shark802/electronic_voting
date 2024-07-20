import "/javascript/logout.js"

const register_device_nav = document.querySelector("#register_device_nav");
const registered_device = document.querySelector("#registered_device");

register_device_nav.classList.remove("font-normal");
register_device_nav.classList.add("active-page");

$("#register_device_subpage").show();

registered_device.classList.add("active-nav");

// Hide Sidebar
document.querySelector("#show-sidebar").addEventListener("click", () => {
    $("#sidebar").show(100);
});
// Show Sidebar
document.querySelector("#hide-sidebar").addEventListener('click', () => {
    $("#sidebar").hide(100);
});