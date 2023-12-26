import { padWithZero } from "./padWithZero";

export const generateNumbers = (
    numberOfItems: number,
    options: {
        repeatNTimes?: number;
        padNumbersWithZero?: boolean;
        disableInfiniteScroll?: boolean;
        padWithNItems: number;
    }
) => {
    if (numberOfItems <= 0) {
        return [];
    }

    let numbers: string[] = [];
    if (options.padNumbersWithZero) {
        for (let i = 0; i <= numberOfItems; i++) {
            numbers.push(padWithZero(i));
        }
    } else {
        for (let i = 0; i <= numberOfItems; i++) {
            numbers.push(String(i));
        }
    }
    if ((options.repeatNTimes ?? 1) > 1) {
        numbers = Array(options.repeatNTimes).fill(numbers).flat();
    }
    if (options.disableInfiniteScroll) {
        numbers.push(...Array(options.padWithNItems).fill(""));
        numbers.unshift(...Array(options.padWithNItems).fill(""));
    }
    return numbers;
};

export const generate12HourNumbers = (
    options: {
        repeatNTimes?: number;
        padNumbersWithZero?: boolean;
        disableInfiniteScroll?: boolean;
        padWithNItems: number;
    }
) => {
    let numbers: string[] = [];

    // Generate numbers from 0 to 11 for AM
    for (let i = 0; i <= 11; i++) {
        const formattedNumber = options.padNumbersWithZero
            ? padWithZero(i)
            : String(i);
        numbers.push(`${formattedNumber} AM`);
    }

    // Generate numbers from 12 to 11 for PM
    for (let i = 12; i <= 23; i++) {
        const hour = i > 12 ? i - 12 : i;
        const formattedNumber = options.padNumbersWithZero
            ? padWithZero(hour)
            : String(hour);
        numbers.push(`${formattedNumber} PM`);
    }

    if ((options.repeatNTimes ?? 1) > 1) {
        numbers = Array(options.repeatNTimes).fill(numbers).flat();
    }

    if (options.disableInfiniteScroll) {
        numbers.push(...Array(options.padWithNItems).fill(""));
        numbers.unshift(...Array(options.padWithNItems).fill(""));
    }

    return numbers;
};
