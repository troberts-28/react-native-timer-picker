import { padWithZero } from "./padWithZero";

export const generateNumbers = (
    max: number,
    options?: { repeatNTimes?: number; padWithZero?: boolean }
) => {
    let numbers: string[] = [];
    if (options?.padWithZero) {
        for (let i = 0; i <= max; i++) {
            numbers.push(padWithZero(i));
        }
    } else {
        for (let i = 0; i <= max; i++) {
            numbers.push(String(i));
        }
    }
    if ((options?.repeatNTimes ?? 1) > 1) {
        numbers = Array(options?.repeatNTimes).fill(numbers).flat();
    }
    return numbers;
};
