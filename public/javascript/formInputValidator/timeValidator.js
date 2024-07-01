export function isValidStartTime(arrayValue, errorMessagDispaly) {
    try {
        if(!Array.isArray(arrayValue) || arrayValue.length < 1) throw new Error(`${arrayValue} is not a valid array`);

        
    } catch (error) {
        console.error(error);
    }

}

export function isValidEndTime(arrayValue, errorMessagDispaly) {
    try {
        if(!Array.isArray(arrayValue) || arrayValue.length < 1) throw new Error(`${arrayValue} is not a valid array`);

        const inputEndTime = arrayValue[0].value;
        const inputStartTime = arrayValue[1].value;
        
        const endTime = new Date(inputEndTime);
        const startTime = new Date(inputStartTime);

    } catch (error) {
        console.error(error);
    }
}