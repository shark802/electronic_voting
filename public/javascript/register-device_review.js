const register_device_nav = document.querySelector("#register_device_nav")
const review_request = document.querySelector("#review_request")

register_device_nav.classList.remove("font-normal")
register_device_nav.classList.add("active-page")

$("#register_device_subpage").slideDown(500);

review_request.classList.add("active-nav")