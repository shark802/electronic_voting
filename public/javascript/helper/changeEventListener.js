/**
 * Adds a change event listener to the specified input element.
 *
 * @param {HTMLInputElement} inputElement - The input element to which the event listener will be added.
 * @param {Function} inputValidator - The validation function to be called on input change.
 * @param {Array} arrayValue - An array containing the values to be validated.
 * @param {HTMLElement} errorMessage - The HTML element to display the error message.
 */
export function changeEventListener(arrayValue, inputValidator, errorMessage, ) {
    try {
        // arrayValue[1] = arrayValue[1] || undefined
        // if(!(arrayValue[0] instanceof HTMLInputElement) || !(arrayValue[1] instanceof HTMLInputElement)) throw new Error("Invalid HTML input element");
        
        arrayValue[0].addEventListener("change", (event) => {
            const valueToCheck = event.target;
            const valueToCompare = arrayValue[1] || undefined;
            
            inputValidator([valueToCheck, valueToCompare], errorMessage)
        })
    } catch (error) {
        console.error(error);
    }
}