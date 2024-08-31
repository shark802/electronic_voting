import { hideLoader, showLoading } from "/javascript/helper/loader.js";
import { isInputNotEmpty } from "/javascript/formInputValidator/isInputNotEmpty.js";
import "/javascript/logout.js"
import { confirmErrorAlert, showSwalSuccessToast } from "/javascript/helper/sweetAlertFunctions.js";

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


document.querySelector('#user-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formSubmitMethod = event.target.dataset.method;

    const idNumber = event.target.querySelector('#id-number');
    const course = event.target.querySelector('#course');
    const firstname = event.target.querySelector('#firstname');
    const lastname = event.target.querySelector('#lastname');

    // error message div element;
    const idNumberErrorMessage = document.querySelector('#id-number-error-message');
    const courseErrorMessage = document.querySelector('#course-error-message');
    const firstnameErrorMessage = document.querySelector('#firstname-error-message');
    const lastnameErrorMessage = document.querySelector('#lastname-error-message');

    const isValidIdNumber = isInputNotEmpty([idNumber], idNumberErrorMessage);
    const isValidCourse = isInputNotEmpty([course], courseErrorMessage)
    const isValidFirstname = isInputNotEmpty([firstname], firstnameErrorMessage)
    const isValidLastname = isInputNotEmpty([lastname], lastnameErrorMessage)
    await fetchUser(idNumber.value)

    if (!isValidIdNumber || !isValidCourse || !isValidFirstname || !isValidLastname) return;

    const url = fetchUrlByFormMethod(formSubmitMethod);
    const userObject = {
        id_number: idNumber.value,
        course: course.value,
        firstname: firstname.value,
        lastname: lastname.value,
    }
    const userRoles = getUserRoles();

    const response = await userFormSubmitToServer(formSubmitMethod, url, userObject, userRoles);
    const responseObject = await response.json();

    if (!response.ok) return confirmErrorAlert(responseObject.message);
    else return showSwalSuccessToast(responseObject.message);
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

async function fetchUser(userId) {
    try {
        if (!userId) throw new Error('Missing user id required for validating user id input');

        const response = await fetch(`/api/user/${userId}`);
        const responseObject = await response.json();

        const user = responseObject.user;
        const isUserExist = user ? true : false;

        isUserExist ? document.querySelector('#id-number-error-message').textContent = 'Id number already exist' : document.querySelector('#id-number-error-message').textContent = '';
        return isUserExist;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function userFormSubmitToServer(formSubmitMethod, fetchUrl, userObject, userRoles) {
    try {
        const response = await fetch(fetchUrl, {
            method: formSubmitMethod,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userObject, userRoles })
        });

        return response;

    } catch (error) {
        console.error(error);
    }
}

document.querySelector('#id-number').addEventListener('change', async (event) => {
    const form = event.target.closest('#user-form');
    const formMethod = form.dataset.method;
    if (formMethod !== 'POST') return;

    const userId = event.target.value;
    try {
        showLoading();
        const user = await fetchUser(userId);
        hideLoader();

        if (user) {
            form.querySelector('#id-number-error-message').textContent = 'Id number already exist';
        } else {
            form.querySelector('#id-number-error-message').textContent = '';
        }

    } catch (error) {
        console.error(error);
    }
})
