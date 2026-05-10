/**
 * Helpers for the `separateAmPmPicker` representation. The hour column tracks an
 * `hourSlot` index in [0, 11] where slot 0 is the noon/midnight "12" position and
 * slots 1–11 display as themselves. The AM/PM column tracks 0 (AM) or 1 (PM).
 * The public API always exposes 24-hour values.
 */

export const splitHour24 = (hour24: number): { amPm: 0 | 1; hourSlot: number } => {
  if (hour24 === 0) return { amPm: 0, hourSlot: 0 };
  if (hour24 === 12) return { amPm: 1, hourSlot: 0 };
  if (hour24 < 12) return { amPm: 0, hourSlot: hour24 };
  return { amPm: 1, hourSlot: hour24 - 12 };
};

export const combineToHour24 = (hourSlot: number, amPm: number): number => {
  if (hourSlot === 0) return amPm === 1 ? 12 : 0;
  return hourSlot + (amPm === 1 ? 12 : 0);
};
