export function isValidText(arrayValue, errorMessagDisplay) {
	try {
        if(!Array.isArray(arrayValue) || arrayValue.length < 1) throw new Error(`${arrayValue} is not a valid array`);

		let textInput = arrayValue[0].value
		
		if(textInput.trim() === "") {
			arrayValue[0].value = ""
			errorMessagDisplay.textContent = "Field must not empty"
			return false;
		}else {
			errorMessagDisplay.textContent = "";
			return true;
		}

	} catch (error) {
		console.error(error);
	}
}
