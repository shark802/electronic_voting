import "/javascript/logout.js";
// import { fetchCandidates } from "/javascript/modules/candidates/fetchCandidates.js";

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
        $(event.target.closest("#election").querySelector("#candidates-display")).slideToggle(300);
    })
})




document.addEventListener('DOMContentLoaded', async () => {
    document.querySelector("#position").classList.remove("text-gray-400");
    document.querySelector("#position").classList.add("selected-position"); // set as default position selected

    const candidates = await fetchCandidates(document.querySelector("#position").textContent);
    displayFetchCandidate(candidates);

})

document.querySelectorAll("#position").forEach(position => {
    position.addEventListener('click', async (event) => {
        styleSelectedPosition(event);

        const candidates = await fetchCandidates(position.textContent);
        displayFetchCandidate(candidates);
    });
});

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

        console.log(candidate);
        const tableRow = `
            <tr class="hover:bg-blue-100 border-b-2 transition-all">
                <td class="text-xs font-medium py-2 pl-2 text-gray-600 border-b-gray-400">${candidate.id_number}</td>
                <td class="text-xs font-medium py-2 pl-2 text-gray-600 border-b-gray-400">${candidate.lastname}, ${candidate.firstname}</td>
                <td class="text-xs font-medium py-2 pl-2 text-gray-600 border-b-gray-400">${candidate.course} ${candidate.year_level} ${candidate.section}</td>
                <td class="text-xs font-medium py-2 pl-2 text-gray-600 border-b-gray-400 text-center">${candidate.enabled}</td>
            </tr>
        `
        document.querySelector(`tbody[data-election-id="${candidate.election_id}"]`).innerHTML += tableRow;
        console.log(document.querySelector(`tbody[data-election-id="${candidate.election_id}"]`));
    })
}