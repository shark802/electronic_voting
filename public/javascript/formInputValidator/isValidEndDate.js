export function isValidEndDate(arrayValue, errorMessageDisplay) {
    try {
        if(!Array.isArray(arrayValue) || arrayValue.length < 1) throw new Error(`${arrayValue} is not a valid array`);

        const valueToCheck = arrayValue[0].value;
        const valueToCompare = arrayValue[1].value || undefined;
        
        const PRESENT_DATE = new Date();
        const endDateValue = new Date(valueToCheck);
        const startDateValue = new Date(valueToCompare);

        PRESENT_DATE.setHours(0, 0, 0, 0);
        endDateValue.setHours(0, 0, 0, 0);
        startDateValue.setHours(0, 0, 0, 0);

        console.log(arrayValue)
        console.log("Start date: ", startDateValue)

        if (valueToCheck.trim() === "") {
            errorMessageDisplay.textContent = "End date must not be empty";
            return false;
        } else if (endDateValue < PRESENT_DATE) {
            errorMessageDisplay.textContent = "End date must not be in the past";
            return false;
        } else if (endDateValue < startDateValue) {
            errorMessageDisplay.textContent = "End date must not past of start date";
            return false;
        } else {
            errorMessageDisplay.textContent = "";
            return true;
        } 

    } catch (error) {
        console.error(error);
    }
}