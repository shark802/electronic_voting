const candidate_nav = document.querySelector("#candidate_nav");
const manage_candidate = document.querySelector("#manage_candidate");

candidate_nav.classList.remove("font-normal");
candidate_nav.classList.add("active-page");

$("#candidate_subpage").slideDown(500);

manage_candidate.classList.add("active-nav");
