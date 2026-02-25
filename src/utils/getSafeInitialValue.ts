/**
 * Safely extracts and validates initial duration values, ensuring all values are valid numbers.
 * Returns a duration object with safe default values (0) for any invalid or missing inputs.
 *
 * @param {Object} [initialValue] - Optional initial duration values
 * @param {number} [initialValue.days] - Initial days value
 * @param {number} [initialValue.hours] - Initial hours value
 * @param {number} [initialValue.minutes] - Initial minutes value
 * @param {number} [initialValue.seconds] - Initial seconds value
 *
 * @returns {{ days: number; hours: number; minutes: number; seconds: number }} An object containing safe duration values
 *
 * @example
 * // With valid values
 * getSafeInitialValue({ days: 1, hours: 2, minutes: 30, seconds: 45 })
 * // Returns: { days: 1, hours: 2, minutes: 30, seconds: 45 }
 *
 * @example
 * // With invalid values
 * getSafeInitialValue({ days: NaN, hours: 'invalid', minutes: undefined })
 * // Returns: { days: 0, hours: 0, minutes: 0, seconds: 0 }
 *
 * @example
 * // With undefined input
 * getSafeInitialValue(undefined)
 * // Returns: { days: 0, hours: 0, minutes: 0, seconds: 0 }
 */
export const getSafeInitialValue = (
  initialValue:
    | {
        days?: number;
        hours?: number;
        minutes?: number;
        seconds?: number;
      }
    | undefined
) => ({
  days:
    typeof initialValue?.days === "number" && !isNaN(initialValue?.days) ? initialValue.days : 0,
  hours:
    typeof initialValue?.hours === "number" && !isNaN(initialValue?.hours) ? initialValue.hours : 0,
  minutes:
    typeof initialValue?.minutes === "number" && !isNaN(initialValue?.minutes)
      ? initialValue.minutes
      : 0,
  seconds:
    typeof initialValue?.seconds === "number" && !isNaN(initialValue?.seconds)
      ? initialValue.seconds
      : 0,
});
