export function validateText(textInput) {
	if (!textInput) {
		console.error(`Text Input ${textInput} not found`);
		return;
	}

	let result = fasle;

	textInput.addEventListener("change", (event) => {
		let textValue = event.target.value.trim();

		if (textValue === "") {
			result = false;
		} else {
			result = true;
		}
	});
	return result;
}
