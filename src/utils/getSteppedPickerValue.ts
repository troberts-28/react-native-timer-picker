/**
 * Returns the next valid value for a picker column when a screen reader user increments or
 * decrements it, together with the number of rows to move to reach it.
 *
 * Steps one slot at a time in `direction` until `isValueValid` accepts one, rather than
 * stepping once and snapping. Snapping strands values: on a non-looping column with a
 * wraparound limit (e.g. `hourLimit` of 8 PM through 5 AM) the valid values form two islands,
 * and a snap always pulls back to the island you started on. It can also land on a value with
 * no row when a limit does not fall on the interval grid.
 *
 * @returns The next valid value and the signed row delta, or `null` when there is nowhere to
 * move: a single-item column, the hard end of a non-looping column, or no other valid value.
 *
 * @example
 * // 24-hour column limited to 8 PM - 5 AM, infinite scroll off, currently at 5 AM
 * getSteppedPickerValue({ currentValue: 5, direction: 1, ... })
 * // Returns: { steps: 15, value: 20 } — crosses the gap instead of stalling at 5
 */
export const getSteppedPickerValue = (variables: {
  currentValue: number;
  direction: 1 | -1;
  disableInfiniteScroll: boolean;
  interval: number;
  isValueValid: (value: number) => boolean;
  numberOfItems: number;
}): { steps: number; value: number } | null => {
  const { currentValue, direction, disableInfiniteScroll, interval, isValueValid, numberOfItems } =
    variables;

  if (numberOfItems <= 1 || !(interval > 0)) {
    return null;
  }

  const lastSlot = numberOfItems - 1;
  const currentSlot = Math.min(Math.max(Math.round(currentValue / interval), 0), lastSlot);

  for (let steps = 1; steps <= lastSlot; steps++) {
    const rawSlot = currentSlot + direction * steps;

    if (disableInfiniteScroll && (rawSlot < 0 || rawSlot > lastSlot)) {
      return null;
    }

    const value = (((rawSlot % numberOfItems) + numberOfItems) % numberOfItems) * interval;

    if (isValueValid(value)) {
      return { steps: direction * steps, value };
    }
  }

  return null;
};
