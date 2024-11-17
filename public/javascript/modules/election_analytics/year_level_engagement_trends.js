import { getAllCompleteElections } from "/javascript/modules/election_analytics/voter_engagement_trends.js"

async function fetchElectionTurnoutPerYearLevel() {
    try {
        const response = await fetch('/api/election/turn-out/year-level');
        const responseObject = await response.json();

        if (!response.ok) throw new Error(responseObject?.message || 'Unexpected server error!');
        return responseObject?.turnoutPerYearLevel
    } catch (error) {
        console.error(error);
    }
}

async function fetchAllYearLevel() {
    try {
        const response = await fetch('/api/year-level');
        const responseObject = await response.json();

        if (!response.ok) throw new Error(responseObject?.message || 'Unexpected server error!');
        return responseObject?.yearLevels
    } catch (error) {
        console.error(error);
    }
}

const turnoutPerYearLevel = await fetchElectionTurnoutPerYearLevel();
const yearLevel = await fetchAllYearLevel();
let completeElections = await getAllCompleteElections();
completeElections.reverse()
const electionIds = completeElections.map(election => election.election_id);

function getTuroutPerentagePerYearLevel(electionIdArray, turnoutPerYearLevel, yearLevel) {
    return yearLevel.map(year => {

        // const yearLevelTurnouts = turnoutPerYearLevel
        //     .filter(data => electionIdArray.includes(data.electionId) && data.yearLevel === year)
        //     .map(data => data.turnOutPercentage)


        const yearLevelTurnouts = electionIdArray.map(electionId => {
            const data = turnoutPerYearLevel.find(data => data.electionId === electionId && data.yearLevel === year);
            return data && data.turnOutPercentage !== undefined ? data.turnOutPercentage : null;
        });

        return { year, yearLevelTurnouts }
    })
}

const chartLineColor = ['#22c55e', '#eab308', '#ef4444', '#3b82f6', '#8b5cf6', '#0891b2']

function prepareChartData(yearLevel, preparedData) {
    return yearLevel.map((year, index) => {
        const turnoutData = preparedData.find(data => data.year === year)?.yearLevelTurnouts;

        let yearLvl = ''
        switch (year) {
            case 1:
                yearLvl = '1st Year'
                break;
            case 2:
                yearLvl = '2nd Year'
                break;
            case 3:
                yearLvl = '3rd Year'
                break;

            default:
                yearLvl = String(year) + 'th Year'
                break;
        }

        return {
            label: yearLvl,
            data: turnoutData,
            borderColor: chartLineColor[index],
            borderWidth: 2,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            fill: true,
            tension: 0.4,
            pointRadius: 3,
        }
    })
}
const preparedData = getTuroutPerentagePerYearLevel(electionIds, turnoutPerYearLevel, yearLevel);
const chartData = prepareChartData(yearLevel, preparedData);

export function renderYearLevelVoteTrends(chartId, completedElections, chartData) {
    const canvas = document.querySelector(`#${chartId}`);

    if (!canvas) return;

    if (canvas.chartInstance) {
        canvas.chartInstance.destroy;
    }

    canvas.chartInstance = new Chart(canvas, {
        type: 'line',
        data: {
            labels: completedElections.map(election => election.election_name),
            datasets: chartData
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    // max: 100,
                    ticks: {
                        // stepSize: 20,
                        callback: function (value) {
                            return value + '%';
                        }
                    },

                },
                x: {
                    ticks: {
                        display: false
                    }
                },
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let yearLevel = context.dataset.label;
                            yearLevel = Number(yearLevel[0])

                            const electionId = completedElections[context.dataIndex].election_id;
                            const yearLevelElectionTurnout = turnoutPerYearLevel.find(data => data.electionId === electionId && data.yearLevel === yearLevel)
                            const turnoutPercentage = context.raw;

                            return [
                                `Year Level: ${yearLevel}`,
                                `Turnout Percentage: ${turnoutPercentage}%`,
                                `Voted: ${yearLevelElectionTurnout.totalVoted}/${yearLevelElectionTurnout.totalVoter}`,
                            ]
                        }
                    },
                    bodyFont: {
                        size: 16,
                    },
                    padding: 10,
                },
            }
        }
    })
}
const canvasId = 'engagement-per-year-level';
renderYearLevelVoteTrends(canvasId, completeElections, chartData)