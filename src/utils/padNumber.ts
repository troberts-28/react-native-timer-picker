export const padNumber = (
    value: number,
    numberOfItems?: number,
    isPricePicker?: boolean,
    centDataLimit?: number,
    centDataIterationValue?: number,
    options?: { padWithZero?: boolean }
): string => {
    if (
        numberOfItems === centDataLimit &&
        isPricePicker &&
        centDataIterationValue
    ) {
        const centValue = value * centDataIterationValue;
        return String(centValue);
    } else if (value < 10) {
        return (options?.padWithZero ? "0" : " ") + value;
    } else {
        return String(value);
    }
};
