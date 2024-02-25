import { padNumber } from "./padNumber";

export const generateNumbers = (
    numberOfItems: number,
    isPricePicker: boolean | undefined,
    centDataLimit: number | undefined,
    centDataIterationValue: number | undefined,
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
    for (let i = 0; i <= numberOfItems; i++) {
        numbers.push(
            padNumber(
                // added extra params to change the generation of cent value.
                i,
                numberOfItems,
                isPricePicker,
                centDataLimit,
                centDataIterationValue,
                { padWithZero: options.padNumbersWithZero }
            )
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

export const generate12HourNumbers = (options: {
    repeatNTimes?: number;
    padNumbersWithZero?: boolean;
    disableInfiniteScroll?: boolean;
    padWithNItems: number;
}) => {
    let numbers: string[] = [];

    // Generate numbers from 0 to 11 for AM
    for (let i = 0; i <= 11; i++) {
        numbers.push(
            `${padNumber(i, 0, false, 0, 0, {
                //Added as same function parameters of generateNUmber :may need to change if want in AM or Pm
                padWithZero: options.padNumbersWithZero,
            })} AM`
        );
    }

    // Generate numbers from 12 to 11 for PM
    for (let i = 12; i <= 23; i++) {
        const hour = i > 12 ? i - 12 : i;
        numbers.push(
            `${padNumber(hour, 0, false, 0, 0, {
                //Added as same function parameters of generateNUmber :may need to change if want in AM or Pm
                padWithZero: options.padNumbersWithZero,
            })} PM`
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
