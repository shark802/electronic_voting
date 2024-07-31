document.querySelectorAll("#vote-now-button").forEach(button => {
    button.addEventListener('click', async event => {
        const parentSection = event.target.parentElement;
        const electionId = event.target.closest('section').querySelector("#election-id").textContent;

        const present = new Date();

        let start = new Date(parentSection.querySelector("#date-start").value);
        const [startHour, startMinute] = parentSection.querySelector("#time-start").value.split(":");
        start.setHours(startHour, startMinute);

        let end = new Date(parentSection.querySelector("#date-end").value);
        const [endHour, endMinute] = parentSection.querySelector("#time-end").value.split(":");
        end.setHours(endHour, endMinute);

        if (present >= start && present <= end) {
            // Request for election ballot to vote
            window.location.href = `/ballot/${electionId}`;
        } else if (present < start) {
            Swal.fire({
                toast: true,
                showConfirmButton: false,
                position: 'top',
                timer: 3000,
                timerProgressBar: true,
                icon: 'warning',
                title: 'Voting has not started yet. Please come back later.'
            })
            return;
        } else if (end < present) {
            Swal.fire({
                toast: true,
                showConfirmButton: false,
                position: 'top',
                timer: 3000,
                timerProgressBar: true,
                icon: 'error',
                title: 'Voting period is over. You cannot vote anymore.',
            })

            // fetch the result if election is finished
            const electionId = parentSection.querySelector("#election-id").textContent;
            console.log("viewing result ", electionId);
            return;
        }
    })
})