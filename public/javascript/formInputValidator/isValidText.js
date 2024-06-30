export function isValidText(arrayValue, errorMessagDispaly) {
	try {
        if(!Array.isArray(arrayValue) || arrayValue.length < 1) throw new Error(`${arrayValue} is not a valid array`);

		let textInput = arrayValue[0].value
		
		if(textInput.trim() === "") {
			arrayValue[0].value = ""
			errorMessagDispaly.textContent = "Field must not empty"
			return false
		}else {
			errorMessagDisp;
		}

	} catch (error) {
		console.error(error);
		return false
	}
}
