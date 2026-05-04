/**
 * Helpers for the `separateAmPmPicker` representation. The hour column tracks a
 * 0–11 cycle index (where 0 is the noon/midnight "12" slot) and the AM/PM column
 * tracks 0 (AM) or 1 (PM). The public API always exposes 24-hour values.
 */

export const splitHour24 = (hour24: number): { amPm: 0 | 1; cycleIdx: number } => {
  if (hour24 === 0) return { amPm: 0, cycleIdx: 0 };
  if (hour24 === 12) return { amPm: 1, cycleIdx: 0 };
  if (hour24 < 12) return { amPm: 0, cycleIdx: hour24 };
  return { amPm: 1, cycleIdx: hour24 - 12 };
};

export const combineToHour24 = (cycleIdx: number, amPm: number): number => {
  if (cycleIdx === 0) return amPm === 1 ? 12 : 0;
  return cycleIdx + (amPm === 1 ? 12 : 0);
};
