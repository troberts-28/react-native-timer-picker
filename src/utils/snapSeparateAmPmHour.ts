import type { Limit } from "../components/DurationScroll/types";
import { isWithinLimit } from "./isWithinLimit";
import { combineToHour24 } from "./separateAmPmHour";

const resolveLimit = (limit: Limit | undefined): { max: number; min: number } | null => {
  if (!limit || (limit.min === undefined && limit.max === undefined)) return null;
  return {
    max: limit.max ?? 23,
    min: limit.min ?? 0,
  };
};

/**
 * Returns the cycleIdx in [0, 11] nearest to `rawCycleIdx` such that
 * `(cycleIdx, currentAmPm)` is within `hourLimit`. If no value in the column's
 * range satisfies the limit, `rawCycleIdx` is returned unchanged (no snap).
 */
export const findNearestValidCycleIdx = (
  rawCycleIdx: number,
  currentAmPm: number,
  hourLimit: Limit | undefined
): number => {
  const resolved = resolveLimit(hourLimit);
  if (!resolved) return rawCycleIdx;

  if (isWithinLimit(combineToHour24(rawCycleIdx, currentAmPm), resolved.min, resolved.max)) {
    return rawCycleIdx;
  }

  let best: number | null = null;
  let bestDistance = Infinity;
  for (let i = 0; i <= 11; i++) {
    if (!isWithinLimit(combineToHour24(i, currentAmPm), resolved.min, resolved.max)) continue;
    const distance = Math.abs(i - rawCycleIdx);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = i;
    }
  }

  return best ?? rawCycleIdx;
};
