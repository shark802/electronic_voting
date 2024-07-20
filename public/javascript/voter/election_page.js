import "/javascript/voter/election_page_click_vote.js";

document.querySelectorAll("#vote-now-button").forEach(button => {
    const parentSection = button.parentElement;

    let start = new Date(parentSection.querySelector("#date-start").value);
    const [startHour, startMinute] = parentSection.querySelector("#time-start").value.split(":");
    start.setHours(startHour, startMinute);

    let end = new Date(parentSection.querySelector("#date-end").value);
    const [endHour, endMinute] = parentSection.querySelector("#time-end").value.split(":");
    end.setHours(endHour, endMinute);

    setInterval(() => {
        let present = new Date();

         if (start <= present && end >= present) { // means voting is now available
            button.style.backgroundColor = '#3b82f6';
            button.style.color = "white" 
         }
         
         if (present > end) { // means voting is finiished
            button.textContent = "View Result"
            button.style.backgroundColor = "#22c55e";
            button.style.color = "white" 
         }

    }, 1000);  

})