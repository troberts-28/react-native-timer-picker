export const padNumber = (
    value: number,
    options?: { padWithZero?: boolean }
): string => {
    if (value < 10) {
        if (!options?.padWithZero) {
            console.log(value, " " + value);
        }
        return (options?.padWithZero ? "0" : " ") + value;
    } else {
        return String(value);
    }
};
