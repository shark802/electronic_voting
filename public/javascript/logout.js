const logoutButton = document.querySelector("#logout-button");

logoutButton.addEventListener('click', () => {
    Swal.fire({
        title: "Are you sure you want to logout?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, logout!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
        confirmButtonColor: "#2060f7",
        cancelButtonColor: "#d93627"
    })
    .then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch("/api/logout", {method: "POST"})
                if(!response.ok) {
                    return;
                }
                Swal.fire({
                    title: "You have been logout",
                    icon: "success",
                    confirmButtonColor: "#2060f7",
                });
            } catch (error) {
                console.error(error);
            }
        } 
    })
})