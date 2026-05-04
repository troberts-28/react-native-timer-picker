import type { Limit } from "../components/DurationScroll/types";

/**
 * Adjusts and validates the min/max limits for a scrollable number picker.
 *
 * `max` is clamped to the picker's maximum value and `min` is clamped to 0.
 * `max < min` is allowed and means a wraparound range (e.g. `{ min: 20, max: 5 }`
 * on the hours picker selects 8 PM through 5 AM the next day).
 *
 * @param {Limit | undefined} limit - The input limit object containing optional min and max values
 * @param {number} numberOfItems - Total number of items in the picker
 * @param {number} interval - The interval between consecutive numbers
 *
 * @returns {{ max: number; min: number }} An object containing the adjusted min and max limits
 *
 * @example
 * // With valid limits
 * getAdjustedLimit({ min: 5, max: 15 }, 20, 1)
 * // Returns: { max: 15, min: 5 }
 *
 * @example
 * // With out-of-bounds limits
 * getAdjustedLimit({ min: -5, max: 25 }, 20, 1)
 * // Returns: { max: 19, min: 0 }
 *
 * @example
 * // Wraparound range (e.g. 8 PM through 5 AM on the hours picker)
 * getAdjustedLimit({ min: 20, max: 5 }, 24, 1)
 * // Returns: { max: 5, min: 20 }
 */
export const getAdjustedLimit = (
  limit: Limit | undefined,
  numberOfItems: number,
  interval: number
): {
  max: number;
  min: number;
} => {
  const maxValue = (numberOfItems - 1) * interval;

  if (!limit || (limit.max === undefined && limit.min === undefined)) {
    return {
      max: maxValue,
      min: 0,
    };
  }

  const adjustedMaxLimit = limit.max !== undefined ? Math.min(limit.max, maxValue) : maxValue;
  const adjustedMinLimit = limit.min !== undefined ? Math.max(limit.min, 0) : 0;

  return {
    max: adjustedMaxLimit,
    min: adjustedMinLimit,
  };
};
