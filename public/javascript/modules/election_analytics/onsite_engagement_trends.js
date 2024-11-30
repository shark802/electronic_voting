async function getAllCompleteElections() {
    try {
        const response = await fetch('/api/election/complete/total-voted');
        const responseObject = await response.json();

        if (!response.ok) {
            const errorMessage = responseObject?.message ?? 'Unxpected error response from server!';
            throw new Error(errorMessage);
        }

        return responseObject?.completedElections;

    } catch (error) {
        console.error(error);
    }
}


async function fetchVoteModeSummary() {
    try {

        const response = await fetch('/api/election/turn-out/vote-mode');
        const responseObject = await response.json();
        if (!response.ok) throw new Error('Error on fetching voting mode summaries');

        return responseObject?.votingModeSummary;

    } catch (error) {
        console.error(error);

    }
}


async function renderOnsiteEngagementTrends(completedElectionsArray, canvasId) {
    try {
        const canvas = document.querySelector(`#${canvasId}`);
        if (!canvas) {
            throw new Error('Canvas element not found');
        }

        // Turnout percentage per election 
        let datasets = await fetchVoteModeSummary();
        const onsiteVotingPercentage = datasets.map(data => data.onsite_vote_percentage)

        // destroy existing if present
        if (canvas.chartInstance) {
            canvas.chartInstance.destroy();
        }

        canvas.chartInstance = new Chart(canvas, {
            type: 'line',
            data: {
                labels: completedElectionsArray.map(election => election.election_name),
                datasets: [{
                    label: 'Past Elections Voter Engagement Trends',
                    data: onsiteVotingPercentage,
                    borderWidth: 2,
                    borderColor: '#3b82f6',
                    backgroundColor: '#93c5fd',
                    fill: true,
                    tension: 0.4,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        ticks: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        // max: 100,
                        ticks: {
                            callback: function (value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {

                                const electionPopulation = completedElectionsArray[context.dataIndex].total_populations;
                                const electionNumberVoted = completedElectionsArray[context.dataIndex].total_voted;
                                const date = new Date(completedElectionsArray[context.dataIndex].date_end).toLocaleDateString();
                                const percentage = context.raw + '%';
                                const votedOnCampus = datasets[context.dataIndex].voted_onsite

                                return [
                                    `Vote Onsite Percentage:  ${percentage}`,
                                    `Voted on Campus: ${votedOnCampus}/${electionNumberVoted}`,
                                    `Date:  ${date}`
                                ];
                            }
                        },
                        bodyFont: {
                            size: 16,
                        },
                        padding: 10,
                    }
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
}
let completedElections = await getAllCompleteElections();
completedElections.reverse()
const canvasId = 'onsite-engagement'
await renderOnsiteEngagementTrends(completedElections, canvasId)


export { getAllCompleteElections, renderOnsiteEngagementTrends };
