import { hideLoader, showLoading } from "/javascript/helper/loader.js";
import { isInputNotEmpty } from "/javascript/formInputValidator/isInputNotEmpty.js";
import "/javascript/logout.js"
import { confirmAlert, confirmErrorAlert, showSwalSuccessToast } from "/javascript/helper/sweetAlertFunctions.js";

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

    if (formSubmitMethod === 'POST') await fetchUser(idNumber.value)

    if (!isValidIdNumber || !isValidCourse || !isValidFirstname || !isValidLastname) return;

    const confirmActionMessage = formSubmitMethod === 'POST' ? 'Are you sure you want to add new user?' : 'Are you sure you want to update this user information?'
    const action = await confirmAlert(confirmActionMessage);
    if (!action.isConfirmed) return;

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

document.querySelector('#search-user').addEventListener('submit', async event => {
    event.preventDefault();

    const searchInput = event.target.querySelector('#id_number');
    const searchIdNumberValue = searchInput.value;

    const response = await fetch(`/api/user/${searchIdNumberValue}`);
    const responseObject = await response.json();

    if (!response.ok) return confirmErrorAlert(responseObject.message)
    if (!responseObject.user) return confirmErrorAlert(`User ${searchIdNumberValue} has no record in the system`)

    const formContentObject = {
        formMethod: 'PUT',
        title: 'Edit user',
        submitButtonText: 'Update user',
        user: responseObject.user
    }
    changeUserForm(formContentObject);

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
        await fetchUser(userId);
        hideLoader();

    } catch (error) {
        console.error(error);
    }
});

function changeUserForm(formContentObject) {
    console.log(formContentObject);
    const form = document.querySelector('#user-form');
    form.reset();

    form.dataset.method = formContentObject.formMethod;
    form.querySelector('h3').textContent = formContentObject.title;
    form.querySelector('#user-form-submit-button').value = formContentObject.submitButtonText;

    if (formContentObject.formMethod === 'PUT') {
        form.querySelector('#id-number').readonly = true;
        form.querySelector('#id-number').value = formContentObject.user.id_number
        form.querySelector('#firstname').value = formContentObject.user.firstname
        form.querySelector('#lastname').value = formContentObject.user.lastname

        const options = form.querySelector('#course').querySelectorAll('option');
        for (const option of options) {
            if (option.value === formContentObject.user.course) {
                option.selected = true;
                break;
            }
        }

        if (formContentObject.user.voter) form.querySelector('#voter').checked = true;
        if (formContentObject.user.program_head) form.querySelector('#voter').checked = true;
        if (formContentObject.user.admin) form.querySelector('#voter').checked = true;
    }


}
