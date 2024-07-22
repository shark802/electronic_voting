import "/javascript/logout.js"

const candidate_nav = document.querySelector("#candidate_nav");
const add_candidate = document.querySelector("#add_candidate");

candidate_nav.classList.remove("font-normal");
candidate_nav.classList.add("active-page");

$("#candidate_subpage").show();

add_candidate.classList.add("active-nav");

// Hide Sidebar
document.querySelector("#show-sidebar").addEventListener("click", () => {
    $("#sidebar").show(100);
});
// Show Sidebar
document.querySelector("#hide-sidebar").addEventListener('click', () => {
    $("#sidebar").hide(100);
});

const election = document.querySelector("#election");
const idNumber = document.querySelector("#id-number");
const firstname = document.querySelector("#firstname");
const lastname = document.querySelector("#lastname");
const alias = document.querySelector("#alias");
const program = document.querySelector("#program");
const party = document.querySelector("#party");
const position = document.querySelector("#position");

document.querySelector("#candidate-form").addEventListener('submit', async (event) => {
    event.preventDefault();

    console.log(election.value);
    console.log(program.value);
    console.log(position.value);

    const requestBody = {
        election_id: election.value,
        id_number: idNumber.value,
        firstname: firstname.value,
        lastname: lastname.value,
        alias: alias.value,
        course: program.value,
        party: party.value,
        position: position.value
    }

    try {

        const response = await fetch("/api/candidate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        })

        if (!response.ok) {
            const responseObject = await response.json();
            Swal.fire({
                title: responseObject.name,
                text: responseObject.message,
                icon: "error",
            });
            return;
        } else {
            Swal.fire({
                showConfirmButton: false,
                title: "New Candidate added successfully",
                icon: "success",
                toast: true,
                position: "top",
                timer: 5000,
            });
            return;
        }

    } catch (error) {
        console.error(error);
    }

})
