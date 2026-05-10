import { isWithinLimit } from "./isWithinLimit";

/**
 * Returns the in-range value closest (in scroll distance) to `value`, honouring
 * wraparound limits where `max < min`. When `value` is already in range it is
 * returned unchanged.
 */
export const getNearestInRange = (value: number, min: number, max: number): number => {
  if (isWithinLimit(value, min, max)) return value;

  if (max < min) {
    // wraparound: value lies in the gap between max and min
    const distanceForwardToMin = min - value;
    const distanceBackwardToMax = value - max;
    return distanceForwardToMin <= distanceBackwardToMax ? min : max;
  }

  return value > max ? max : min;
};
