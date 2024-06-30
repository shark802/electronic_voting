const dashboard_nav = document.querySelector("#dashboard_nav")
const vote_tally_page = document.querySelector("#vote_tally_page")

dashboard_nav.classList.remove("font-normal")
dashboard_nav.classList.add("active-page")
// dashboard_nav.style.color = "green"

$("#dashboard_subpage").show()

vote_tally_page.classList.add("active-nav")