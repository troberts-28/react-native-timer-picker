import { padNumber } from "./padNumber";

export const generateNumbers = (
    numberOfItems: number,
    options: {
        disableInfiniteScroll?: boolean;
        interval: number;
        padNumbersWithZero?: boolean;
        padWithNItems: number;
        repeatNTimes: number;
    }
) => {
    if (numberOfItems <= 0) {
        return [];
    }

    let numbers: string[] = [];
    for (let i = 0; i < numberOfItems; i++) {
        const value = i * options.interval;
        numbers.push(
            padNumber(value, { padWithZero: options.padNumbersWithZero })
        );
    }

    if (options.repeatNTimes > 1) {
        numbers = Array(options.repeatNTimes).fill(numbers).flat();
    }
    if (options.disableInfiniteScroll || options.repeatNTimes === 1) {
        numbers.push(...Array(options.padWithNItems).fill(""));
        numbers.unshift(...Array(options.padWithNItems).fill(""));
    }
    return numbers;
};

export const generate12HourNumbers = (options: {
    disableInfiniteScroll?: boolean;
    interval: number;
    padNumbersWithZero?: boolean;
    padWithNItems: number;
    repeatNTimes?: number;
}) => {
    let numbers: string[] = [];

    // Generate numbers from 0 to 11 for AM
    for (let i = 0; i < 12; i += options.interval) {
        numbers.push(
            `${padNumber(i, { padWithZero: options.padNumbersWithZero })} AM`
        );
    }

    // Generate numbers from 12 to 11 for PM
    for (let i = 12; i < 24; i += options.interval) {
        const hour = i > 12 ? i - 12 : i;
        numbers.push(
            `${padNumber(hour, { padWithZero: options.padNumbersWithZero })} PM`
        );
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
