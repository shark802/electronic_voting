import "/javascript/logout.js"
// import Chart from '/javascript/lib/chart.js';

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

    const electionsCandidateData = await fetchAllCandidatesDataForActiveElection();

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
                    const candidatesToDisplay = electionsCandidateData.filter(candidate => candidate.position === 'SENATOR' && candidate.election_id === electionId && candidate.course === canvas.id);

                    new Chart(canvas, {
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
                    })
                })

            } else {

                const canvas = div.querySelector('canvas');
                const candidatesToDisplay = electionsCandidateData.filter(candidate => candidate.position === canvas.id && candidate.election_id === electionId);

                new Chart(canvas, {
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
            label: 'Vote count',
            data: dataset.map(candidate => Math.round(candidate.vote_count)),
            backgroundColor: [
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 99, 132, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 159, 64, 0.5)'
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