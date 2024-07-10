document.querySelector("#login-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.querySelector("#school-id");
    const password = document.querySelector("#password");

    console.log(username.value);
    console.log(password.value);

    // document.querySelector("#login-modal").style.display = "none";
    Swal.fire({
        title: "Good job!",
        text: "You clicked the button!",
        icon: "success"
    });
})