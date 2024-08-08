import "/javascript/logout.js"

const register_device_nav = document.querySelector("#register_device_nav")
const review_request = document.querySelector("#review_request")

register_device_nav.classList.remove("font-normal")
register_device_nav.classList.add("active-page")

$("#register_device_subpage").slideDown(500);

review_request.classList.add("active-nav");

// Hide Sidebar
document.querySelector("#show-sidebar").addEventListener("click", () => {
    $("#sidebar").show(100);
});
// Show Sidebar
document.querySelector("#hide-sidebar").addEventListener('click', () => {
    $("#sidebar").hide(100);
});

declineDeviceRegistration();

function declineDeviceRegistration() {
    document.querySelector("#register-device-table").addEventListener('click', async (event) => {
        if (event.target.id === "decline-request") {
            const rowClicked = event.target.closest('tr').querySelector("#uuid");
            console.log(rowClicked);
        }
        // const rowClicked = event.target.closest('tr').querySelector("#uuid");
        // console.log(rowClicked);
    })
}