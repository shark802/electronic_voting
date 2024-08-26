import { showSwalErrorToast, confirmErrorAlert, confirmAlert, showSwalSuccessToast } from "/javascript/helper/sweetAlertFunctions.js"

const overview_page = document.querySelector("#overview_page");
overview_page.classList.add("active-nav");

document.addEventListener('DOMContentLoaded', async () => {

    const electionIdList = Array.from(document.querySelectorAll('#election-section')).map(election => election.dataset.electionId);
    const urlParams = electionIdList.map(electionId => `election_id=${electionId}`).join('&');

    const electionTotalPopulation = await fetchElectionPopulation(urlParams);

})


// helper functions
async function fetchElectionPopulation(urlParams) {
    try {
        const url = `/api/election-population?${urlParams}`
        const response = await fetch(url);
        const responseObject = await response.json()

        if (!response.ok) return showSwalErrorToast(responseObject.message);

        return responseObject.elections;
    } catch (error) {
        console.error(error);
    }
}