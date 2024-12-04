import { getAllCompleteElections } from "/javascript/modules/election_analytics/voter_engagement_trends.js"

async function fetchElectionTurnoutPerDepartment() {
    try {
        const response = await fetch('/api/election/turn-out/department');
        const responseObject = await response.json();

        if (!response.ok) throw new Error(responseObject?.message || 'Unexpected server error!');
        return responseObject?.turnoutPerDepartment
    } catch (error) {
        console.error(error);
    }
}

async function fetchAllDepartment() {
    try {
        const response = await fetch('/api/departments');
        const responseObject = await response.json();

        if (!response.ok) throw new Error(responseObject?.message || 'Unexpected server error!');
        return responseObject?.departments
    } catch (error) {
        console.error(error);
    }
}

const turnoutPerDepartment = await fetchElectionTurnoutPerDepartment();
const departments = await fetchAllDepartment();
let completeElections = await getAllCompleteElections();

completeElections.reverse()
const electionIds = completeElections.map(election => election.election_id);

function getTuroutPerentagePerDepartment(electionIdArray, turnoutPerDepartment, departments) {
    return departments.map(department => {
        const departmentCode = department.department_code

        // const departmentsTurnouts = turnoutPerDepartment
        //     .filter(data => electionIdArray.includes(data.electionId) && data.department === department.department_code)
        //     .map(data => data.turnOutPercentage)

        const departmentsTurnouts = electionIdArray.map(electionId => {
            const data = turnoutPerDepartment.find(data => data.electionId === electionId && data.department === departmentCode);
            return data && data.turnOutPercentage !== undefined ? data.turnOutPercentage : null;
        });
        return { departmentCode, departmentsTurnouts }
    })
}

const chartLineColor = ['#eab308', '#ef4444', '#3b82f6', '#22c55e', '#8b5cf6', '#0891b2']

function prepareChartData(departments, preparedData) {
    return departments.map((department, index) => {
        const turnoutData = preparedData.find(data => data.departmentCode === department.department_code)?.departmentsTurnouts;

        return {
            label: department.department_code,
            data: turnoutData,
            borderColor: chartLineColor[index],
            borderWidth: 2,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            fill: true,
            tension: 0.4,
            pointRadius: 2.3,
        }
    })
}
const preparedData = getTuroutPerentagePerDepartment(electionIds, turnoutPerDepartment, departments);
const chartData = prepareChartData(departments, preparedData);

export function renderDepartmentsVoteTrends(chartId, completedElections, chartData) {
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
                            const department = context.dataset.label;
                            const electionId = completedElections[context.dataIndex].election_id;
                            const departmentElectionTurnout = turnoutPerDepartment.find(data => data.electionId === electionId && data.department === department)
                            const turnoutPercentage = context.raw;

                            return [
                                `Department: ${department}`,
                                `Turnout Percentage: ${turnoutPercentage}%`,
                                `Voted: ${departmentElectionTurnout.totalVoted}/${departmentElectionTurnout.totalVoter}`,
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

const canvasId = 'engagement-per-department';
renderDepartmentsVoteTrends(canvasId, completeElections, chartData)