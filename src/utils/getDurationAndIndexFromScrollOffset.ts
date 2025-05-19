/**
 * Calculates the duration value and index from a scroll offset in a number picker.
 * Handles both infinite and non-infinite scroll modes, taking into account padding and item height.
 *
 * @param {Object} variables - Configuration object for scroll offset calculation
 * @param {boolean} variables.disableInfiniteScroll - Whether infinite scroll is disabled
 * @param {number} variables.interval - The interval between consecutive numbers
 * @param {number} variables.itemHeight - Height of each item in the picker
 * @param {number} variables.numberOfItems - Total number of items in the picker
 * @param {number} variables.padWithNItems - Number of empty items to pad with
 * @param {number} variables.yContentOffset - The vertical scroll offset
 *
 * @returns {{ duration: number; index: number }} Object containing the calculated duration and index
 *
 * @example
 * // With infinite scroll enabled
 * getDurationAndIndexFromScrollOffset({
 *   disableInfiniteScroll: false,
 *   interval: 1,
 *   itemHeight: 50,
 *   numberOfItems: 24,
 *   padWithNItems: 2,
 *   yContentOffset: 100
 * })
 * // Returns: { duration: 2, index: 2 }
 *
 * @example
 * // With infinite scroll disabled
 * getDurationAndIndexFromScrollOffset({
 *   disableInfiniteScroll: true,
 *   interval: 1,
 *   itemHeight: 50,
 *   numberOfItems: 24,
 *   padWithNItems: 2,
 *   yContentOffset: 100
 * })
 * // Returns: { duration: 2, index: 2 }
 */
export const getDurationAndIndexFromScrollOffset = (variables: {
    disableInfiniteScroll: boolean;
    interval: number;
    itemHeight: number;
    numberOfItems: number;
    padWithNItems: number;
    yContentOffset: number;
}) => {
    const {
        disableInfiniteScroll,
        interval,
        itemHeight,
        numberOfItems,
        padWithNItems,
        yContentOffset,
    } = variables;

    const index = Math.round(yContentOffset / itemHeight);

    const duration =
        ((disableInfiniteScroll ? index : index + padWithNItems) %
            numberOfItems) *
        interval;

    return {
        duration,
        index,
    };
};
