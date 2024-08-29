import "/javascript/logout.js"

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


document.querySelector('#user-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const formSubmitMethod = event.target.dataset.method;

    const idNumber = event.target.querySelector('#id-number');
    const course = event.target.querySelector('#course');
    const firstname = event.target.querySelector('#firstname');
    const lastname = event.target.querySelector('#lastname');

    const userObject = {
        course: course.value,
        firstname: firstname.value,
        lastname: lastname.value,
    }

    const userRoles = getUserRoles();

    console.log(userObject);
    console.log(userRoles);
    console.log(fetchUrlByFormMethod(formSubmitMethod));
});

function getUserRoles() {
    const rolesCheckBox = document.querySelector('#user-roles').querySelectorAll('input[type=checkbox]');

    const userRoleObject = Array.from(rolesCheckBox).reduce((object, roleCheckBox) => {
        object[roleCheckBox.value] = roleCheckBox.checked;
        return object;
    }, {});

    return userRoleObject;
}

function fetchUrlByFormMethod(formSubmitMethod) {
    let fetchUrl = '';

    switch (formSubmitMethod) {
        case "POST": fetchUrl = '/api/user-new'
            break;
        case "PUT": fetchUrl = '/api/user-update'
            break;
        default:
            break;
    }

    return fetchUrl;
}