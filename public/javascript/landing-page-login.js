import { changeEventListener } from "/javascript/helper/changeEventListener.js";
import { isValidText } from "/javascript/formInputValidator/isValidText.js"
import { showLoading, hideLoader } from "/javascript/helper/loader.js";

const schoolIdErrorMessage = document.querySelector("#schoolIdErrorMessage");
const passwordErrorMessage = document.querySelector("#passwordErrorMessage");
const id_number = document.querySelector("#school-id");
const password = document.querySelector("#password");

changeEventListener(isValidText, [id_number], schoolIdErrorMessage);
changeEventListener(isValidText, [password], passwordErrorMessage);

document.querySelector("#login-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    if (
        !isValidText([id_number], schoolIdErrorMessage) ||
        !isValidText([password], passwordErrorMessage)
    ) {
        return
    }

    try {
        showLoading()
        event.target.closest("dialog").close();
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "id_number": id_number.value, "password": password.value })
        });

        if (!response.ok) {
            hideLoader();
            document.querySelector('#login-modal').close();
            Swal.fire({
                title: "Login Failed!",
                icon: "error"
            });

        } else {
            // hideLoader()
            const responseObject = await response.json();

            if (responseObject.roles.admin === 1 || responseObject.roles.program_head === 1) return window.location.href = "/admin/dashboard/overview";
            if (responseObject.roles.voter === 1) return window.location.href = "/election";

        }

    } catch (error) {
        console.error(error.message);
    }

})