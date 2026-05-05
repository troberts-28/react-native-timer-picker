import { findNearestValidHourSlot } from "../utils/snapSeparateAmPmHour";

describe("findNearestValidHourSlot", () => {
  describe("no limit", () => {
    it.each([0, 5, 11])("returns the input hourSlot %i unchanged", (hourSlot) => {
      expect(findNearestValidHourSlot(hourSlot, 0, undefined)).toBe(hourSlot);
      expect(findNearestValidHourSlot(hourSlot, 1, undefined)).toBe(hourSlot);
    });

    it("treats an empty Limit object as no limit", () => {
      expect(findNearestValidHourSlot(7, 0, {})).toBe(7);
    });
  });

  describe("normal limit { min: 9, max: 17 }", () => {
    const limit = { max: 17, min: 9 };

    it.each([
      [0, 9], // 12 AM (=0) invalid → snap to 9 AM
      [1, 9],
      [8, 9],
      [9, 9],
      [10, 10],
      [11, 11],
    ])("AM hourSlot %i snaps to %i", (input, expected) => {
      expect(findNearestValidHourSlot(input, 0, limit)).toBe(expected);
    });

    it.each([
      [0, 0], // 12 PM (=12) is valid
      [1, 1], // 1 PM = 13, valid
      [5, 5], // 5 PM = 17, valid
      [6, 5], // 6 PM = 18, invalid → nearest valid PM hourSlot is 5
      [11, 5],
    ])("PM hourSlot %i snaps to %i", (input, expected) => {
      expect(findNearestValidHourSlot(input, 1, limit)).toBe(expected);
    });
  });

  describe("wraparound limit { min: 20, max: 5 } (8 PM – 5 AM)", () => {
    const limit = { max: 5, min: 20 };

    it.each([
      [0, 0], // 12 AM = 0, valid
      [5, 5], // 5 AM = 5, valid
      [6, 5], // 6 AM = 6, invalid → nearest valid AM is 5
      [10, 5],
      [11, 5],
    ])("AM hourSlot %i snaps to %i", (input, expected) => {
      expect(findNearestValidHourSlot(input, 0, limit)).toBe(expected);
    });

    it.each([
      [0, 8], // 12 PM = 12, invalid → nearest valid PM is hourSlot 8 (= 20)
      [7, 8],
      [8, 8], // 8 PM = 20, valid
      [11, 11], // 11 PM = 23, valid
    ])("PM hourSlot %i snaps to %i", (input, expected) => {
      expect(findNearestValidHourSlot(input, 1, limit)).toBe(expected);
    });
  });

  describe("limit excludes one full half", () => {
    it("returns input unchanged when no AM hourSlot is valid (limit forces PM)", () => {
      // limit { min: 13, max: 17 } means only PM hours 13-17 are valid
      // No AM hourSlot (which gives 0 or 1-11) can land in [13, 17].
      expect(findNearestValidHourSlot(5, 0, { max: 17, min: 13 })).toBe(5);
    });

    it("returns input unchanged when no PM hourSlot is valid (limit forces AM)", () => {
      // limit { min: 1, max: 5 } means only AM hours 1-5 are valid; no PM combo works.
      expect(findNearestValidHourSlot(7, 1, { max: 5, min: 1 })).toBe(7);
    });
  });

  it("respects limit with only min set (max defaults to 23)", () => {
    expect(findNearestValidHourSlot(0, 0, { min: 12 })).toBe(0); // No AM works; falls through to input
    expect(findNearestValidHourSlot(0, 1, { min: 12 })).toBe(0); // 12 PM = 12, valid
  });

  it("respects limit with only max set (min defaults to 0)", () => {
    expect(findNearestValidHourSlot(0, 0, { max: 5 })).toBe(0); // 12 AM = 0, valid
    expect(findNearestValidHourSlot(11, 0, { max: 5 })).toBe(5);
  });

  describe("with hourInterval", () => {
    // generate12HourCycleNumbers iterates `i = 0; i < 12; i += interval`. The snap
    // helper must mirror that so it never returns an hourSlot not present in the column.
    it.each([
      // interval=2 → hour slots [0, 2, 4, 6, 8, 10]
      [2, 0, 0, { max: 17, min: 9 }, 10], // raw 0 AM invalid; nearest valid AM hourSlot is 10
      [2, 5, 0, { max: 17, min: 9 }, 10], // raw 5 (not in column) invalid; nearest is 10
      [2, 4, 1, { max: 17, min: 9 }, 4], // raw 4 PM = 16, valid → unchanged
      // interval=3 → hour slots [0, 3, 6, 9]
      [3, 0, 0, { max: 17, min: 9 }, 9], // 12 AM invalid; only 9 AM in column is in range
      [3, 6, 1, { max: 17, min: 9 }, 3], // 6 PM=18 invalid; nearest valid PM hourSlot is 3 (3 PM=15)
      // interval=4 → hour slots [0, 4, 8]
      [4, 0, 0, { max: 17, min: 9 }, 0], // no AM hourSlot in column is valid → no snap (returns input)
      [4, 0, 1, { max: 17, min: 9 }, 0], // 12 PM=12 IS in [9,17] → unchanged
      [4, 0, 1, { max: 17, min: 13 }, 4], // 12 PM=12 invalid in [13,17]; nearest PM is 4 (4 PM=16)
    ])("interval=%i, raw=%i, amPm=%i, limit=%p → %i", (interval, raw, amPm, limit, expected) => {
      expect(findNearestValidHourSlot(raw, amPm, limit, interval)).toBe(expected);
    });

    it("never returns an hourSlot outside the rendered set when called with a valid raw", () => {
      // interval=2: rendered hour slots are {0,2,4,6,8,10}. The raw hourSlot in real
      // usage always comes from getDurationAndIndexFromScrollOffset (= multiple of interval).
      const limit = { max: 17, min: 9 };
      const renderedSet = [0, 2, 4, 6, 8, 10];
      for (const raw of renderedSet) {
        const result = findNearestValidHourSlot(raw, 0, limit, 2);
        expect(renderedSet.includes(result)).toBe(true);
      }
    });
  });
});
