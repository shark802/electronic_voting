const queryParams = new URLSearchParams(window.location.search);
const electionId = queryParams.get("election_id");

const electionSelectElement = document.querySelector("#election");
const options = electionSelectElement.querySelectorAll("option");

for (let option of options) {
    if (option.value === electionId) {
        option.selected = true;
        break;
    }
}