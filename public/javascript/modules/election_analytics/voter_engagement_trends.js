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

function renderVoterEngagementTrends(completedElectionsArray, canvasId) {
    try {
        const canvas = document.querySelector(`#${canvasId}`);
        if (!canvas) {
            throw new Error('Canvas element not found');
        }

        // Turnout percentage per election 
        const datasets = completedElectionsArray.map(election => {
            const electionTotalPopulation = election?.total_populations;
            const electionTotalVoted = election?.total_voted;

            return (electionTotalVoted / electionTotalPopulation) * 100;
        });

        // destroy existing if present
        if (canvas.chartInstance) {
            canvas.chartInstance.destroy();
        }

        canvas.chartInstance = new Chart(canvas, {
            type: 'line',
            data: {
                labels: Array(datasets.length).fill(''),
                datasets: [{
                    label: 'Past Elections Voter Engagement Trends',
                    data: datasets,
                    borderColor: '#2563eb',
                    backgroundColor: '#60a5fa',
                    fill: true,
                    tension: 0.4,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
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

                                const electionName = completedElectionsArray[context.dataIndex].election_name;
                                const electionPopulation = completedElectionsArray[context.dataIndex].total_populations;
                                const electionNumberVoted = completedElectionsArray[context.dataIndex].total_voted;
                                const date = new Date(completedElectionsArray[context.dataIndex].date_end).toLocaleDateString();
                                const percentage = context.raw.toFixed(2) + '%';

                                return [
                                    `Percentage:  ${percentage}`,
                                    `Election Name:  ${electionName}`,
                                    `Total Population:  ${electionPopulation}`,
                                    `Total Voted:  ${electionNumberVoted}`,
                                    `Date:  ${date}`
                                ];
                            }
                        },
                        bodyFont: {
                            size: 16,
                        },
                    }
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
}

export { getAllCompleteElections, renderVoterEngagementTrends };
