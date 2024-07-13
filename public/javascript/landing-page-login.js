import {changeEventListener} from "/javascript/helper/changeEventListener.js";
import { isValidText } from "/javascript/formInputValidator/isValidText.js"

const schoolIdErrorMessage = document.querySelector("#schoolIdErrorMessage");
const passwordErrorMessage = document.querySelector("#passwordErrorMessage");
const id_number = document.querySelector("#school-id");
const password = document.querySelector("#password");

changeEventListener([id_number], isValidText, schoolIdErrorMessage);
changeEventListener([password], isValidText, passwordErrorMessage);

document.querySelector("#login-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    if(
        !isValidText([id_number], schoolIdErrorMessage) ||
        !isValidText([password], passwordErrorMessage)
    ) {
        return
    }

    try {
        
        const response = await fetch("/api/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"id_number": id_number.value, "password": password.value})
        });
        
        if (!response.ok) {
            
            document.querySelector('#login-modal').close();
            Swal.fire({
                title: "Login Failed!",
                icon: "error"
            });

        } else {
            event.target.reset();
            document.querySelector("#login-modal").close();
            Swal.fire({
                title: "Success!",
                text: "Login successfully ",
                icon: "success"
            }).then(result => {
                if(result.isConfirmed) {
                    window.location.href = "/election";
                }
            });
        }

    } catch (error) {
        console.error(error.message);
    }
    
})