const loginModal = document.querySelector('#login-modal');

document.querySelector('#login-button').addEventListener('click', () => {
    loginModal.showModal();
});

document.querySelector("#login-modal-exit").addEventListener('click', function(event) {
    loginModal.close();
});


document.querySelector("#login-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.querySelector("#school-id");
    const password = document.querySelector("#password");

    console.log(username.value);
    console.log(password.value);

    document.querySelector("#login-modal").close();
    Swal.fire({
        title: "Good job!",
        text: "You clicked the button!",
        icon: "success"
    });
})