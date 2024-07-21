document.querySelectorAll("#delete_election_button").forEach(deleteButon => {
    deleteButon.addEventListener('click', async (event) => {
        const electionId = event.target.closest("#electionSection").querySelector("#election-card-id").textContent;
        $(event.target.closest("#more-option")).hide(100);

        Swal.fire({
            title: "Are you sure you want to delete this?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {

                const response = await fetch(`/api/elections/${electionId}`, { method: "DELETE" });
                if (response.ok) {
                    $(event.target.closest("#election-card")).hide(100);

                    Swal.fire({
                        title: "Deleted!",
                        text: "Election has been deleted.",
                        icon: "success"
                    });

                } else {
                    Swal.fire({
                        title: "Failed!",
                        text: "An error occured. Please try again!",
                        icon: "error"
                    });
                }


            }
        });

    })
})