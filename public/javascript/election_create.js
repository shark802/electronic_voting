const election_nav = document.querySelector("#election_nav")
const create_election_page = document.querySelector("#create_election_page")

election_nav.classList.remove("font-normal")
election_nav.classList.add("active-page")

create_election_page.classList.add("active-nav")
$("#election_subpage").show()

console.log('hello 123')