const voter_nav = document.querySelector("#voter_nav")
const manage_voter_nav = document.querySelector("#manage_voter_nav")

voter_nav.classList.remove("font-normal")
voter_nav.classList.add("active-page")

$("#voter_subpage").slideDown(500)

manage_voter_nav.classList.add("active-nav")

