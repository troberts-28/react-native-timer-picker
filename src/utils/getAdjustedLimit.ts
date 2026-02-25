import type { Limit } from "../components/DurationScroll/types";

/**
 * Adjusts and validates the min/max limits for a scrollable number picker.
 * Ensures limits are within valid bounds and handles edge cases.
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
 * // With invalid limits (max < min)
 * getAdjustedLimit({ min: 15, max: 5 }, 20, 1)
 * // Returns: { max: 19, min: 0 }
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

  // guard against limits that are out of bounds
  const adjustedMaxLimit = limit.max !== undefined ? Math.min(limit.max, maxValue) : maxValue;
  const adjustedMinLimit = limit.min !== undefined ? Math.max(limit.min, 0) : 0;

  // guard against invalid limits
  if (adjustedMaxLimit < adjustedMinLimit) {
    return {
      max: maxValue,
      min: 0,
    };
  }

  return {
    max: adjustedMaxLimit,
    min: adjustedMinLimit,
  };
};
