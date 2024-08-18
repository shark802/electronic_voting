import "/javascript/logout.js"

const voter_nav = document.querySelector("#voter_nav")
const manage_voter_nav = document.querySelector("#manage_voter_nav")

voter_nav.classList.remove("font-normal")
voter_nav.classList.add("active-page")

$("#voter_subpage").slideDown(500)

manage_voter_nav.classList.add("active-nav");

// Hide Sidebar
document.querySelector("#show-sidebar").addEventListener("click", () => {
    $("#sidebar").show(100);
});
// Show Sidebar
document.querySelector("#hide-sidebar").addEventListener('click', () => {
    $("#sidebar").hide(100);
});

filterVotedUserByElection();

async function filterVotedUserByElection() {
    const selectElement = document.querySelector('#filter-by-election');
    selectElement.addEventListener('change', async () => {
        if (!selectElement.value) return window.location = '/admin/voter/manage';

        const form = document.querySelector('#filter-voted-users-form');
        if (form) {
            console.log('submit');
            return form.submit();
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {
    const searchParams = new URLSearchParams(window.location.search);
    const selectedElection = searchParams.get('election_id');

    document.querySelector('#filter-by-election').querySelectorAll('option').forEach(option => {
        if (option.value === selectedElection) {
            return option.selected = true;
        }
    })
})