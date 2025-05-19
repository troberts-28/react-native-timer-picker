import { padNumber } from "./padNumber";

/**
 * Generates an array of formatted numbers for a number picker, with support for infinite scroll,
 * padding, and number repetition.
 *
 * @param {number} numberOfItems - Total number of items to generate
 * @param {Object} options - Configuration options for number generation
 * @param {boolean} [options.disableInfiniteScroll] - Whether to disable infinite scroll
 * @param {number} options.interval - The interval between consecutive numbers
 * @param {boolean} [options.padNumbersWithZero] - Whether to pad single-digit numbers with leading zeros
 * @param {number} options.padWithNItems - Number of empty items to pad with
 * @param {number} options.repeatNTimes - How many times to repeat the number sequence
 *
 * @returns {string[]} Array of formatted number strings
 *
 * @example
 * // Generate numbers 0-9 with padding
 * generateNumbers(10, {
 *   interval: 1,
 *   padWithNItems: 2,
 *   repeatNTimes: 1,
 *   padNumbersWithZero: true
 * })
 * // Returns: ['', '', '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '', '']
 *
 * @example
 * // Generate even numbers with infinite scroll
 * generateNumbers(5, {
 *   interval: 2,
 *   padWithNItems: 2,
 *   repeatNTimes: 3,
 *   disableInfiniteScroll: false
 * })
 * // Returns: ['0', '2', '4', '6', '8', '0', '2', '4', '6', '8', '0', '2', '4', '6', '8']
 */
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

/**
 * Generates an array of formatted 12-hour time strings (AM/PM) for a time picker.
 * Supports infinite scroll, padding, and number repetition.
 *
 * @param {Object} options - Configuration options for time generation
 * @param {boolean} [options.disableInfiniteScroll] - Whether to disable infinite scroll
 * @param {number} options.interval - The interval between hours (must be a divisor of 12)
 * @param {boolean} [options.padNumbersWithZero] - Whether to pad single-digit hours with leading zeros
 * @param {number} options.padWithNItems - Number of empty items to pad with
 * @param {number} [options.repeatNTimes] - How many times to repeat the time sequence (defaults to 1)
 *
 * @returns {string[]} Array of formatted 12-hour time strings
 *
 * @example
 * // Generate hours with 1-hour interval
 * generate12HourNumbers({
 *   interval: 1,
 *   padWithNItems: 2,
 *   padNumbersWithZero: true
 * })
 * // Returns: ['', '', '12 AM', '01 AM', '02 AM', ..., '11 PM', '', '']
 *
 * @example
 * // Generate hours with 2-hour interval and infinite scroll
 * generate12HourNumbers({
 *   interval: 2,
 *   padWithNItems: 2,
 *   repeatNTimes: 2,
 *   disableInfiniteScroll: false
 * })
 * // Returns: ['12 AM', '2 AM', '4 AM', ..., '10 PM', '12 AM', '2 AM', ...]
 */
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
