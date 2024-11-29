import "/javascript/logout.js"
import socket from "/javascript/socket_io.js"
// import Chart from '/javascript/lib/chart.js';

let electionsCandidateData; // Declare the variable in a higher scope

const dashboard_nav = document.querySelector("#dashboard_nav")
const vote_tally_page = document.querySelector("#vote_tally_page")

dashboard_nav.classList.remove("font-normal")
dashboard_nav.classList.add("active-page")

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
    electionsCandidateData = await fetchAllCandidatesDataForActiveElection(); // Assign data to the variable

    const activeElections = document.querySelectorAll('section'); // select all section element that represent each active election
    activeElections.forEach(election => {
        const electionId = election.dataset.electionId;

        const positionDivContainer = election.querySelectorAll('#position-container'); // select all div that serve as container for group of candidate per position
        positionDivContainer.forEach(div => {
            const positionDataAttribute = div.dataset.position; // contain data attribute (data-position) to provide info what position the container holds. // Example: 'PRESIDENT', VICE_PRESIDENT', 'SENATOR'

            if (positionDataAttribute === 'SENATOR') {

                const senatorPositionPerProgam = div.querySelectorAll('#senator-by-program'); // SENATOR div container holds multiple canvas per program
                senatorPositionPerProgam.forEach(program => {

                    const canvas = program.querySelector('canvas'); // Represent as canvas element for each program on senator position
                    const candidatesToDisplay = electionsCandidateData.filter(candidate => candidate.position === 'SENATOR' && candidate.election_id === electionId && candidate.department === canvas.id);
                    createChart(canvas, candidatesToDisplay);
                })

            } else {

                const canvas = div.querySelector('canvas');
                const candidatesToDisplay = electionsCandidateData.filter(candidate => candidate.position === canvas.id && candidate.election_id === electionId);
                createChart(canvas, candidatesToDisplay);
            }
        });

    });

})

let charts = {};

function createChart(canvas, candidatesToDisplay) {
    // Check if a chart already exists for this canvas
    if (charts[canvas.id]) {
        // If it exists, update the chart data instead of recreating it
        updateChart(charts[canvas.id], candidatesToDisplay);
        return;
    }

    // Create a new chart and store the reference
    charts[canvas.id] = new Chart(canvas, {
        type: 'bar',
        data: transformDataset(candidatesToDisplay),
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: calculateStepSize(candidatesToDisplay),
                        font: {
                            size: 9
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 9
                        }
                    }
                },
            },
            layout: {
                padding: 10
            }
        }
    });
}

function updateChart(chart, candidatesToDisplay) {
    // Update the chart's data
    chart.data = transformDataset(candidatesToDisplay);
    chart.update(); // Refresh the chart
}

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
            label: 'Vote count',
            data: dataset.map(candidate => Math.round(candidate.vote_count)),
            backgroundColor: [
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)'
            ],
            borderColor: [
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 99, 132, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
                'rgba(255, 159, 64, 0.8)'
            ],
            borderWidth: 1,
            maxBarThickness: 90
        }]
    }
}

function calculateStepSize(dataset) {
    const range = Math.max(...dataset.map(item => item.vote_count)) - Math.min(...dataset.map(item => item.vote_count));
    return range < 100 ? 1 : 10;
}

socket.on('new-vote', (data) => {

    if (!electionsCandidateData) {
        console.error("electionsCandidateData is not defined.");
        return;
    }

    data.voted_candidate_list.forEach(vote => {
        console.log(`Checking vote for candidate_id: ${vote.candidate_id}, election_id: ${data.election_id}, position: ${vote.candidate_position}`);

        const candidate = electionsCandidateData.find(c =>
            String(c.id_number) === String(vote.candidate_id) &&
            c.election_id === data.election_id &&
            c.position === vote.candidate_position
        );

        if (candidate) {
            console.log(`Found candidate: ${candidate.firstname} ${candidate.lastname}`);
            candidate.vote_count = (candidate.vote_count || 0) + 1;

            const activeElections = document.querySelectorAll('section');
            activeElections.forEach(election => {
                if (election.dataset.electionId === data.election_id) {
                    const positionDivContainer = election.querySelectorAll('#position-container');
                    positionDivContainer.forEach(div => {
                        const canvas = div.querySelector('canvas');
                        const positionDataAttribute = div.dataset.position;

                        if (positionDataAttribute === 'SENATOR') {
                            const senatorCanvases = div.querySelectorAll('canvas');

                            senatorCanvases.forEach(canvas => {
                                const department = canvas.id;

                                console.log(`Updating chart for department: ${department}`);

                                const candidatesToDisplay = electionsCandidateData.filter(candidate =>
                                    candidate.election_id === data.election_id &&
                                    candidate.position === positionDataAttribute &&
                                    candidate.department === department
                                );

                                if (candidatesToDisplay.length > 0) {
                                    updateChart(charts[canvas.id], candidatesToDisplay);
                                } else {
                                    console.log(`No candidates found for department: ${department}`);
                                }
                            });
                        } else {
                            const candidatesToDisplay = electionsCandidateData.filter(candidate =>
                                candidate.election_id === data.election_id &&
                                candidate.position === positionDataAttribute
                            );

                            updateChart(charts[canvas.id], candidatesToDisplay);
                        }
                    });
                }
            });

        } else {
            console.log(`Candidate not found for candidate_id: ${vote.candidate_id} in election_id: ${data.election_id}`);
        }
    });
});