import "/javascript/logout.js"

const dashboard_nav = document.querySelector("#dashboard_nav")
const vote_tally_page = document.querySelector("#vote_tally_page")

dashboard_nav.classList.remove("font-normal")
dashboard_nav.classList.add("active-page")
// dashboard_nav.style.color = "green"

$("#dashboard_subpage").show()

vote_tally_page.classList.add("active-nav");

// Hide Sidebar
document.querySelector("#show-sidebar").addEventListener("click", () => {
    $("#sidebar").show(100);
});
// Show Sidebar
document.querySelector("#hide-sidebar").addEventListener('click', () => {
    $("#sidebar").hide(100);
});

document.addEventListener('DOMContentLoaded', async () => {

    const electionsCandidateData = await fetchAllCandidatesDataForActiveElection();

    const activeElections = document.querySelectorAll('section'); // select all section element that represent each active election
    activeElections.forEach(election => {
        const electionId = election.dataset.electionId;

        const positionDivContainer = election.querySelectorAll('#position-container'); // select all div that will serve as container of candidate position per election 
        positionDivContainer.forEach(div => {
            const positionDataAttribute = div.dataset.position;

            if (positionDataAttribute === 'SENATOR') {

                const senatorPositionPerProgam = div.querySelectorAll('canvas');

            } else {

                const position = div.querySelector('canvas');
                const candidatesToDisplay = electionsCandidateData.filter(candidate => candidate.position === position.id && candidate.election_id === electionId);

                console.log(candidatesToDisplay);
            }
        });

    });

})


async function fetchAllCandidatesDataForActiveElection() {
    try {
        const response = await fetch('/api/candidate/data');
        const responseObject = await response.json();

        if (response.ok) return responseObject.candidatesData;
    } catch (error) {
        console.error(error);

    }
}

function transformDataset(dataset) {
    return {
        labels: dataset.map(candidate => `${candidate.firstname} ${candidate.lastname}`),
        datasets: [{
            data: dataset.map(candidate => candidate.vote_count),
        }]
    }
}