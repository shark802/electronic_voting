// import { setTimeout } from "timers/promises";
import "/javascript/logout.js";

const candidate_nav = document.querySelector("#candidate_nav");
const manage_candidate = document.querySelector("#manage_candidate");

candidate_nav.classList.remove("font-normal");
candidate_nav.classList.add("active-page");

$("#candidate_subpage").slideDown(500);

manage_candidate.classList.add("active-nav");

// Hide Sidebar
document.querySelector("#show-sidebar").addEventListener("click", () => {
    $("#sidebar").show(100);
});
// Show Sidebar
document.querySelector("#hide-sidebar").addEventListener('click', () => {
    $("#sidebar").hide(100);
});


document.querySelectorAll("#election").forEach(election => {
    election.addEventListener('click', event => {
        if (!event.target.closest("#candidates-display")) {
            $(event.target.closest("#election").querySelector("#candidates-display")).slideToggle(300);
        }
    })
})

// display all available candidates when content loaded
document.addEventListener('DOMContentLoaded', async () => {
    document.querySelector("#position").classList.remove("text-gray-400");
    document.querySelector("#position").classList.add("selected-position"); // set as default position selected

    const candidates = await fetchCandidates(document.querySelector("#position").textContent);
    displayFetchCandidate(candidates);

})

// Display all candidates when candidate position option click
document.querySelectorAll("#position").forEach(position => {
    position.addEventListener('click', async (event) => {
        styleSelectedPosition(event);

        const candidates = await fetchCandidates(position.textContent);
        displayFetchCandidate(candidates);
    });
});

document.querySelectorAll("#candidates-section").forEach(section => { // Open more option
    section.addEventListener('click', (event) => {
        if (event.target.closest('#option-section')) {
            toggleMoreOptionDisplay(event);
        }

        if (event.target.closest("#edit")) {
            console.log("EDIT");
        }

    })
});

document.addEventListener('click', event => { // Close if there is an open section  
    if (!event.target.closest("#option-section")) {
        document.querySelectorAll("#candidates-section").forEach(candidateSection => {
            candidateSection.querySelectorAll("#more-option").forEach(section => $(section).slideUp(100))
        })
    }
})

// change the the position selected if click
function styleSelectedPosition(event) {
    document.querySelectorAll("#position").forEach(pos => {
        pos.classList.remove("selected-position");
        pos.classList.add("text-gray-400");
    });

    event.target.classList.remove("text-gray-400");
    event.target.classList.add("selected-position");
}

async function fetchCandidates(position) {
    try {
        const electionsQueryParameter = Array.from(document.querySelectorAll("#election")).map(election => {
            const electionId = election.querySelector("#election-id").textContent.trim();
            return `election_id=${electionId}`;
        }).join("&");

        const url = `/api/candidate?position=${position}&${electionsQueryParameter}`

        const response = await fetch(url);
        if (response.ok) {
            const responseObject = await response.json();
            return responseObject;
        }
    } catch (error) {
        console.error(error);
    }
}

function displayFetchCandidate(candidates) {
    document.querySelectorAll("tbody").forEach(content => {
        content.innerHTML = "";
    })

    candidates.forEach(candidate => {

        const status = candidate.enabled === 1 ? '<div class="active">ACTIVE</div>' : '<div class="inactive">INACTIVE</div>'
        let candidateAddedAt = new Date(candidate.added_at);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };

        candidateAddedAt = candidateAddedAt.toLocaleString('en-US', options);

        const tableRow = `
            <tr class="hover:bg-blue-100 border-b-2 transition-all">
                <td class="text-xs font-medium py-2 pl-2 text-gray-600 border-b-gray-400 text-center">${candidate.id_number}</td>
                <td class="text-xs font-medium py-2 pl-4 text-gray-600 border-b-gray-400">${candidate.lastname}, ${candidate.firstname}</td>
                <td class="text-xs pl-4 font-medium py-2 text-gray-600 border-b-gray-400">${candidate.alias}</td>
                <td class="text-xs font-medium py-2 pl-2 text-gray-600 border-b-gray-400">${candidate.course}</td>
                <td class="text-xs font-medium py-2 pl-2 text-gray-600 border-b-gray-400">${candidateAddedAt}</td>
                <td class="text-xs font-medium py-2 pl-2 text-gray-600 border-b-gray-400 text-center">${status}</td>
                <td>
                    <div class="flex justify-center gap-4 items-center">
                        <div id="option-section" class="relative">
                            <img src="/img/more.webp" class="w-5 hover:cursor-pointer opacity-70 hover:rounded-full hover:bg-blue-300"/>
                            <div id="more-option" class="absolute z-10 right-0 gap-2 px-1 py-3 hidden bg-white border border-solid rounded shadow-md w-36 h-fit top-7">

                                <div id="toggleElectionEventVisibility" class="flex items-center px-3 my-2 transition-all rounded-sm hover:bg-blue-200">
                                    <img id="viewStatusImage" src="/img/hide.webp" alt="hide" class="w-4 h-4">
                                    <p id="viewStatus" class="ml-2">Deactivate</p>
                                </div>

                                <div id="delete_election_button" class="flex items-center px-3 my-2 transition-all rounded-sm hover:bg-blue-200">
                                    <img src="/img/trash.webp" alt="delete" class="w-4 h-4">
                                    <p class="ml-2">Delete</p>
                                </div>

                            </div>
                        </div> 
                        <p id="edit" class="font-semibold hover:cursor-pointer text-blue-500">Edit</p>
                    </div> 
                </td>
            </tr>
        `
        document.querySelector(`tbody[data-election-id="${candidate.election_id}"]`).innerHTML += tableRow;
    })
}

function toggleMoreOptionDisplay(event) {

    document.querySelectorAll("#candidates-section").forEach(section => { // Close other more option if there is opened before opening new option
        section.querySelectorAll("#more-option").forEach(option => {
            if (option !== event.target.closest("#option-section").querySelector("#more-option")) {
                $(option).slideUp(100);
            }
        })
    });

    if (event.target.closest("#more-option")) return;
    $(event.target.closest("#option-section").querySelector("#more-option")).slideToggle(300)
}



