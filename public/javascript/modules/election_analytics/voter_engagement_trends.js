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
                labels: completedElectionsArray.map(election => election.election_name),
                datasets: [{
                    label: 'Past Elections Voter Engagement Trends',
                    data: datasets,
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
                                const percentage = context.raw.toFixed(2) + '%';

                                return [
                                    `Percentage:  ${percentage}`,
                                    `Total Population:  ${electionPopulation}`,
                                    `Total Voted:  ${electionNumberVoted}`,
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

function calculateTurnoutStats(completedElectionsArray) {
    if (!completedElectionsArray || completedElectionsArray.length === 0) {
        return {
            highest: 0,
            lowest: 0,
            average: 0
        };
    }

    const turnouts = completedElectionsArray.map(election => {
        // Add validation and default values
        const totalVoted = Number(election?.total_voted) || 0;
        const totalPopulation = Number(election?.total_populations) || 1; // Prevent division by zero
        return (totalVoted / totalPopulation) * 100;
    }).filter(turnout => !isNaN(turnout));

    // If no valid turnouts, return zeros
    if (turnouts.length === 0) {
        return {
            highest: 0,
            lowest: 0,
            average: 0
        };
    }

    return {
        highest: Math.max(...turnouts).toFixed(2),
        lowest: Math.min(...turnouts).toFixed(2),
        average: (turnouts.reduce((a, b) => a + b, 0) / turnouts.length).toFixed(2)
    };
}

function renderTurnoutDonut(value, elementId, color) {
    const canvas = document.querySelector(`#${elementId}`);
    if (!canvas) return;

    // Ensure value is a valid number
    const numericValue = parseFloat(value) || 0;

    // destroy existing if present
    if (canvas.chartInstance) {
        canvas.chartInstance.destroy();
    }

    canvas.chartInstance = new Chart(canvas, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [numericValue, 100 - numericValue],
                backgroundColor: [color, '#f1f5f9'],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '75%',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    });
}

function renderAllTurnoutStats(completedElectionsArray) {
    const stats = calculateTurnoutStats(completedElectionsArray);

    renderTurnoutDonut(stats.highest, 'highest-turnout-chart', '#22c55e');
    renderTurnoutDonut(stats.lowest, 'lowest-turnout-chart', '#ef4444');
    renderTurnoutDonut(stats.average, 'average-turnout-chart', '#2563eb');

    // Update the percentage text elements
    document.querySelector('#highest-turnout-text').textContent = `${stats.highest}%`;
    document.querySelector('#lowest-turnout-text').textContent = `${stats.lowest}%`;
    document.querySelector('#average-turnout-text').textContent = `${stats.average}%`;
}

export { getAllCompleteElections, renderVoterEngagementTrends, renderAllTurnoutStats };
