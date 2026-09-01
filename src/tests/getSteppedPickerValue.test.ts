import { getNearestInRange } from "../utils/getNearestInRange";
import { getSteppedPickerValue } from "../utils/getSteppedPickerValue";

const allValid = () => true;

const withinLimit = (min: number, max: number) => (value: number) =>
  getNearestInRange(value, min, max) === value;

const step = (
  overrides: Partial<Parameters<typeof getSteppedPickerValue>[0]> & { currentValue: number }
) =>
  getSteppedPickerValue({
    direction: 1,
    disableInfiniteScroll: false,
    interval: 1,
    isValueValid: allValid,
    numberOfItems: 60,
    ...overrides,
  });

describe("getSteppedPickerValue", () => {
  describe("unlimited column", () => {
    it("moves one row up", () => {
      expect(step({ currentValue: 5 })).toEqual({ steps: 1, value: 6 });
    });

    it("moves one row down", () => {
      expect(step({ currentValue: 5, direction: -1 })).toEqual({ steps: -1, value: 4 });
    });

    it("wraps forwards off the end in one row", () => {
      expect(step({ currentValue: 59 })).toEqual({ steps: 1, value: 0 });
    });

    it("wraps backwards off the start in one row", () => {
      expect(step({ currentValue: 0, direction: -1 })).toEqual({ steps: -1, value: 59 });
    });
  });

  describe("interval", () => {
    it("steps by the interval", () => {
      expect(step({ currentValue: 30, interval: 5, numberOfItems: 12 })).toEqual({
        steps: 1,
        value: 35,
      });
    });

    it("stops at the last value on the grid, not at maximumValue", () => {
      // maximumValue 59 with interval 10 renders 0,10,...,50 — there is no row for 59
      expect(step({ currentValue: 50, interval: 10, numberOfItems: 6 })).toEqual({
        steps: 1,
        value: 0,
      });
    });

    it("snaps a value that is off the interval grid to the nearest slot first", () => {
      expect(step({ currentValue: 7, interval: 5, numberOfItems: 12 })).toEqual({
        steps: 1,
        value: 10,
      });
    });
  });

  describe("disableInfiniteScroll", () => {
    it("returns null at the top of the column", () => {
      expect(step({ currentValue: 59, disableInfiniteScroll: true })).toBeNull();
    });

    it("returns null at the bottom of the column", () => {
      expect(step({ currentValue: 0, direction: -1, disableInfiniteScroll: true })).toBeNull();
    });

    it("still moves within the column", () => {
      expect(step({ currentValue: 0, disableInfiniteScroll: true })).toEqual({
        steps: 1,
        value: 1,
      });
    });
  });

  describe("normal limits", () => {
    it("moves within the range", () => {
      expect(step({ currentValue: 16, isValueValid: withinLimit(9, 17) })).toEqual({
        steps: 1,
        value: 17,
      });
    });

    it("cycles from the top of the range back to the bottom", () => {
      expect(step({ currentValue: 17, isValueValid: withinLimit(9, 17) })).toEqual({
        steps: 52,
        value: 9,
      });
    });

    it("cycles from the bottom of the range back to the top", () => {
      expect(step({ currentValue: 9, direction: -1, isValueValid: withinLimit(9, 17) })).toEqual({
        steps: -52,
        value: 17,
      });
    });

    it("stops at the top of the range when the column cannot loop", () => {
      expect(
        step({ currentValue: 17, disableInfiniteScroll: true, isValueValid: withinLimit(9, 17) })
      ).toBeNull();
    });

    it("stops at the bottom of the range when the column cannot loop", () => {
      expect(
        step({
          currentValue: 9,
          direction: -1,
          disableInfiniteScroll: true,
          isValueValid: withinLimit(9, 17),
        })
      ).toBeNull();
    });
  });

  describe("wraparound limits (max < min)", () => {
    // 8 PM through 5 AM next day, on a 24-hour column
    const nightShift = { isValueValid: withinLimit(20, 5), numberOfItems: 24 };

    it("wraps from the end of the day to the start", () => {
      expect(step({ currentValue: 23, ...nightShift })).toEqual({ steps: 1, value: 0 });
    });

    it("crosses the gap between the two halves of the range going up", () => {
      expect(step({ currentValue: 5, ...nightShift })).toEqual({ steps: 15, value: 20 });
    });

    it("crosses the gap between the two halves of the range going down", () => {
      expect(step({ currentValue: 20, direction: -1, ...nightShift })).toEqual({
        steps: -15,
        value: 5,
      });
    });

    it("crosses the gap even when the column cannot loop", () => {
      // regression: stepping once and snapping strands the user on whichever half they start in
      expect(step({ currentValue: 5, disableInfiniteScroll: true, ...nightShift })).toEqual({
        steps: 15,
        value: 20,
      });
    });
  });

  describe("nothing to move to", () => {
    it("returns null when the range holds a single value", () => {
      expect(step({ currentValue: 5, isValueValid: withinLimit(5, 5) })).toBeNull();
    });

    it("returns null when no value is valid", () => {
      expect(step({ currentValue: 5, isValueValid: () => false })).toBeNull();
    });

    it("returns null for a single-item column", () => {
      expect(step({ currentValue: 0, numberOfItems: 1 })).toBeNull();
    });

    it("returns null for a non-positive interval", () => {
      expect(step({ currentValue: 0, interval: 0 })).toBeNull();
    });
  });

  it("skips values the column has disabled", () => {
    const isValueValid = (value: number) => value !== 6 && value !== 7;
    expect(step({ currentValue: 5, isValueValid })).toEqual({ steps: 3, value: 8 });
  });
});
