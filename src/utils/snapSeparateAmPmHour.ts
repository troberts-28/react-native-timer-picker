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
 * Returns the hour slot in the rendered 12-hour clock-face column nearest to
 * `rawHourSlot` such that `(hourSlot, currentAmPm)` is within `hourLimit`. Iterates
 * in `interval` steps to mirror the values actually rendered by
 * `generate12HourCycleNumbers`. If no value in the column satisfies the limit,
 * `rawHourSlot` is returned unchanged.
 */
export const findNearestValidHourSlot = (
  rawHourSlot: number,
  currentAmPm: number,
  hourLimit: Limit | undefined,
  interval = 1
): number => {
  const resolved = resolveLimit(hourLimit);
  if (!resolved) return rawHourSlot;

  if (isWithinLimit(combineToHour24(rawHourSlot, currentAmPm), resolved.min, resolved.max)) {
    return rawHourSlot;
  }

  let best: number | null = null;
  let bestDistance = Infinity;
  for (let i = 0; i < 12; i += interval) {
    if (!isWithinLimit(combineToHour24(i, currentAmPm), resolved.min, resolved.max)) continue;
    const distance = Math.abs(i - rawHourSlot);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = i;
    }
  }

  return best ?? rawHourSlot;
};
