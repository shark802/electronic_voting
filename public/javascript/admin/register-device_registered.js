const register_device_nav = document.querySelector("#register_device_nav");
const registered_device = document.querySelector("#registered_device");

register_device_nav.classList.remove("font-normal");
register_device_nav.classList.add("active-page");

$("#register_device_subpage").show();

registered_device.classList.add("active-nav")