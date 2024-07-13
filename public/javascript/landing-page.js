import "/javascript/landing-page-login.js";

const loginModal = document.querySelector('#login-modal');

document.querySelector('#login-button').addEventListener('click', () => {
    loginModal.showModal();
});

document.querySelector("#login-modal-exit").addEventListener('click', function(event) {
    loginModal.close();
});