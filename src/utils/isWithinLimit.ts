/**
 * Checks whether a value falls inside an inclusive `[min, max]` range, with
 * support for wraparound ranges where `max < min` (e.g. `min: 20, max: 5` on
 * the hours picker means 8 PM through 5 AM next day).
 */
export const isWithinLimit = (value: number, min: number, max: number): boolean =>
  max < min ? value >= min || value <= max : value >= min && value <= max;
