export const padNumber = (
    value: number,
    options?: { padWithZero?: boolean }
): string => {
    if (value < 10) {
        return (options?.padWithZero ? "0" : " ") + value;
    } else {
        return String(value);
    }
};
