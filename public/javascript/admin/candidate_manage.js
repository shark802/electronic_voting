import "/javascript/logout.js"

const candidate_nav = document.querySelector("#candidate_nav");
const manage_candidate = document.querySelector("#manage_candidate");

candidate_nav.classList.remove("font-normal");
candidate_nav.classList.add("active-page");

$("#candidate_subpage").slideDown(500);

manage_candidate.classList.add("active-nav");

// Hide Sidebar
document.querySelector("#show-sidebar").addEventListener("click", () => {
    $("#sidebar").show(100);
});
// Show Sidebar
document.querySelector("#hide-sidebar").addEventListener('click', () => {
    $("#sidebar").hide(100);
});


document.querySelector("#position").classList.remove("text-gray-400");
document.querySelector("#position").classList.add("selected-position"); // set as default position selected

// change the the position selected if click
document.querySelectorAll("#position").forEach(position => {
    position.addEventListener('click', (event) => {
        document.querySelectorAll("#position").forEach(pos => {
            pos.classList.remove("selected-position");
            pos.classList.add("text-gray-400");
        });

        event.target.classList.remove("text-gray-400");
        event.target.classList.add("selected-position");
    });
});
