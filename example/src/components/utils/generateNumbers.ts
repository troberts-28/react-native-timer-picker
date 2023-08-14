import { padWithZero } from "./padWithZero";

export const generateNumbers = (
    max: number,
    options?: { padWithZero?: boolean }
) => {
    const numbers = [""];
    if (options?.padWithZero) {
        for (let i = 0; i <= max; i++) {
            numbers.push(padWithZero(i));
        }
    } else {
        for (let i = 0; i <= max; i++) {
            numbers.push(String(i));
        }
    }
    numbers.push("");
    return numbers;
};
