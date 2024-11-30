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


async function renderOnlineEngagementTrends(completedElectionsArray, canvasId) {
    try {
        const canvas = document.querySelector(`#${canvasId}`);
        if (!canvas) {
            throw new Error('Canvas element not found');
        }

        // Turnout percentage per election 
        let datasets = await fetchVoteModeSummary();
        const onlineVotingPercentage = datasets.map(data => data.online_vote_percentage)

        // destroy existing if present
        if (canvas.chartInstance) {
            canvas.chartInstance.destroy();
        }

        const ctx = canvas.getContext('2d'); // Get the canvas context
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height); // Create a vertical gradient
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)'); // Start color (light blue)
        gradient.addColorStop(1, 'rgba(147, 197, 253, 0.2)'); // End color (lighter blue)

        canvas.chartInstance = new Chart(canvas, {
            type: 'line',
            data: {
                labels: completedElectionsArray.map(election => election.election_name),
                datasets: [{
                    label: 'Past Elections Voter Engagement Trends',
                    data: onlineVotingPercentage,
                    borderWidth: 2,
                    borderColor: '#3b82f6',
                    backgroundColor: gradient, // Use the gradient as background color
                    fill: true,
                    tension: 0.3,
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
                        max: 100,
                        ticks: {
                            stepSize: 20,
                            callback: function (value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false, // Hides the legend
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {

                                const electionPopulation = completedElectionsArray[context.dataIndex].total_populations;
                                const electionNumberVoted = completedElectionsArray[context.dataIndex].total_voted;
                                const date = new Date(completedElectionsArray[context.dataIndex].date_end).toLocaleDateString();
                                const percentage = context.raw + '%';
                                const votedOnCampus = datasets[context.dataIndex].voted_online

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
const canvasId = 'online-engagement'
await renderOnlineEngagementTrends(completedElections, canvasId)


export { getAllCompleteElections, renderOnlineEngagementTrends };
