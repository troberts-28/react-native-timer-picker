/**
 * Announced value for the combined 12-hour hours column, whose values are 24-hour (0-23).
 *
 * @example
 * formatHour12AccessibilityValue(0, "am", "pm") // "12 am"
 * formatHour12AccessibilityValue(17, "am", "pm") // "5 pm"
 */
export const formatHour12AccessibilityValue = (
  hour24: number,
  amLabel: string,
  pmLabel: string
): string => `${hour24 % 12 === 0 ? 12 : hour24 % 12} ${hour24 < 12 ? amLabel : pmLabel}`;

/**
 * Announced value for the hours column when `separateAmPmPicker` is enabled, whose values are
 * hour slots 0-11 with slot 0 displayed as "12".
 *
 * The meridiem is deliberately left out: it is announced by the AM/PM column, which is its own
 * focusable element, so including it here would speak it twice and diverge from what is on screen.
 */
export const formatHourSlotAccessibilityValue = (hourSlot: number): string =>
  String(hourSlot === 0 ? 12 : hourSlot);

/** Announced value for the standalone AM/PM column, whose values are 0 (am) and 1 (pm). */
export const formatAmPmAccessibilityValue = (
  amPm: number,
  amLabel: string,
  pmLabel: string
): string => (amPm === 1 ? pmLabel : amLabel);
