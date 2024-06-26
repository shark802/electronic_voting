export function validateEmail(emailInput) {
	if (!(emailInput instanceof HTMLElement)) {
		console.error(`Invalid argument passed. Expected an HTMLElement.`);
		return;
	}

	let isValid = false;

	emailInput.addEventListener("change", (event) => {
		const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		let emailInputValue = event.target.value.trim();

		if (emailInputValue === "") {
			alert("Whitespace character is invalid");
			event.target.value = "";
			isValid = false;
		} else if (!emailInputValue.match(emailPattern)) {
			alert("Email is invalid");
			isValid = false;
		} else {
			// Clear error message or indicate success
			console.log("Email is valid");
			isValid = true;
		}
	});
	return isValid;
}
