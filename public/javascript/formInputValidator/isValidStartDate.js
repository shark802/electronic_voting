export function isValidStartDate(arrayValue, errorMessageDisplay) {
    try {
        if(!Array.isArray(arrayValue) || arrayValue.length < 1) throw new Error(`${arrayValue} is not a valid array`);

        console.log("Start date value", arrayValue[0].value)

        const PRESENT_DATE = new Date();
        const inputDate = new Date(arrayValue[0].value);

        // Set time components to zero for comparison
        PRESENT_DATE.setHours(0, 0, 0, 0);
        inputDate.setHours(0, 0, 0, 0);

        if (arrayValue[0].value.trim() === "") {
            errorMessageDisplay.textContent = "Start date must not be empty";
            return false;
        } else if (isNaN(inputDate.getTime())) {
            errorMessageDisplay.textContent = "Invalid date format";
            return false;
        } else if (inputDate < PRESENT_DATE) {
            errorMessageDisplay.textContent = "Start date must not be in the past";
            return false;
        } else {
            errorMessageDisplay.textContent = "";
            console.log("valid")
            return true;
        }

    } catch (error) {
        console.error(error);
        return false;
    }
}
