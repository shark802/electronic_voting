document.querySelectorAll("#toggleElectionEventVisibility").forEach(async toggleButton => {
    toggleButton.addEventListener('click', (event) => {
        const electionId = event.target.closest("#electionSection").querySelector("#election-card-id").textContent;

        let viewStatus = event.target.closest("#electionSection").querySelector("#viewStatus");
        let viewStatusImage = event.target.closest("#electionSection").querySelector("#viewStatusImage");
        if(viewStatus.textContent === "Hide") {
            viewStatusImage.src = "/img/view.png"
            viewStatus.textContent = "Show";

        } else {
            viewStatusImage.src = "/img/hide.png"
            viewStatus.textContent = "Hide";
        }
    })
})