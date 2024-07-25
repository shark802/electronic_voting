export async function fetchCandidates(position) {
    try {
        const electionsQueryParameter = Array.from(document.querySelectorAll("#election")).map(election => {
            const electionId = election.querySelector("#election-id").textContent.trim();
            return `election_id=${electionId}`;
        }).join("&");

        const url = `/api/candidate?position=${position}&${electionsQueryParameter}`

        const response = await fetch(url);
        if (response.ok) {
            const responseObject = await response.json();
            return responseObject;
        }
    } catch (error) {
        console.error(error);
    }

}
