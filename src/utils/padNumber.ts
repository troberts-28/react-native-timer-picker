/**
 * Formats a number by optionally padding it with a leading zero or space.
 * Numbers less than 10 are padded based on the options provided.
 *
 * @param {number} value - The number to format
 * @param {Object} [options] - Optional formatting options
 * @param {boolean} [options.padWithZero] - Whether to pad with zero (true) or space (false)
 *
 * @returns {string} The formatted number string
 *
 * @example
 * // Pad with zero
 * padNumber(5, { padWithZero: true })
 * // Returns: '05'
 *
 * @example
 * // Pad with figure space (same width as zero)
 * padNumber(5, { padWithZero: false })
 * // Returns: ' 5'
 *
 * @example
 * // No padding needed
 * padNumber(15)
 * // Returns: '15'
 */
export const padNumber = (value: number, options?: { padWithZero?: boolean }): string => {
  if (value < 10) {
    return (options?.padWithZero ? "0" : "\u2007") + value;
  } else {
    return String(value);
  }
};
