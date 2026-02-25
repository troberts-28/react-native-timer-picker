/**
 * Calculates the initial scroll index for a number picker based on the desired value and configuration.
 * Handles both infinite and non-infinite scroll modes, taking into account padding and repetition.
 *
 * @param {Object} variables - Configuration object for scroll index calculation
 * @param {boolean} variables.disableInfiniteScroll - Whether infinite scroll is disabled
 * @param {number} variables.interval - The interval between consecutive numbers
 * @param {number} variables.numberOfItems - Total number of items in the picker
 * @param {number} variables.padWithNItems - Number of empty items to pad with
 * @param {number} variables.repeatNumbersNTimes - How many times to repeat the number sequence
 * @param {number} variables.value - The desired initial value
 *
 * @returns {number} The calculated initial scroll index
 *
 * @example
 * // With infinite scroll enabled
 * getInitialScrollIndex({
 *   disableInfiniteScroll: false,
 *   interval: 1,
 *   numberOfItems: 24,
 *   padWithNItems: 2,
 *   repeatNumbersNTimes: 3,
 *   value: 12
 * })
 * // Returns: 38
 *
 * @example
 * // With infinite scroll disabled
 * getInitialScrollIndex({
 *   disableInfiniteScroll: true,
 *   interval: 1,
 *   numberOfItems: 24,
 *   padWithNItems: 2,
 *   repeatNumbersNTimes: 1,
 *   value: 12
 * })
 * // Returns: 12
 */
export const getInitialScrollIndex = (variables: {
  disableInfiniteScroll: boolean;
  interval: number;
  numberOfItems: number;
  padWithNItems: number;
  repeatNumbersNTimes: number;
  value: number;
}) => {
  const {
    disableInfiniteScroll,
    interval,
    numberOfItems,
    padWithNItems,
    repeatNumbersNTimes,
    value,
  } = variables;

  return Math.max(
    numberOfItems * Math.floor(repeatNumbersNTimes / 2) +
      ((value / interval + numberOfItems) % numberOfItems) -
      (!disableInfiniteScroll ? padWithNItems : 0),
    0
  );
};
