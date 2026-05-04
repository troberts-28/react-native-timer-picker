import { findNearestValidCycleIdx } from "../utils/snapSeparateAmPmHour";

describe("findNearestValidCycleIdx", () => {
  describe("no limit", () => {
    it.each([0, 5, 11])("returns the input cycleIdx %i unchanged", (cycleIdx) => {
      expect(findNearestValidCycleIdx(cycleIdx, 0, undefined)).toBe(cycleIdx);
      expect(findNearestValidCycleIdx(cycleIdx, 1, undefined)).toBe(cycleIdx);
    });

    it("treats an empty Limit object as no limit", () => {
      expect(findNearestValidCycleIdx(7, 0, {})).toBe(7);
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
    ])("AM cycleIdx %i snaps to %i", (input, expected) => {
      expect(findNearestValidCycleIdx(input, 0, limit)).toBe(expected);
    });

    it.each([
      [0, 0], // 12 PM (=12) is valid
      [1, 1], // 1 PM = 13, valid
      [5, 5], // 5 PM = 17, valid
      [6, 5], // 6 PM = 18, invalid → nearest valid PM cycleIdx is 5
      [11, 5],
    ])("PM cycleIdx %i snaps to %i", (input, expected) => {
      expect(findNearestValidCycleIdx(input, 1, limit)).toBe(expected);
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
    ])("AM cycleIdx %i snaps to %i", (input, expected) => {
      expect(findNearestValidCycleIdx(input, 0, limit)).toBe(expected);
    });

    it.each([
      [0, 8], // 12 PM = 12, invalid → nearest valid PM is cycleIdx 8 (= 20)
      [7, 8],
      [8, 8], // 8 PM = 20, valid
      [11, 11], // 11 PM = 23, valid
    ])("PM cycleIdx %i snaps to %i", (input, expected) => {
      expect(findNearestValidCycleIdx(input, 1, limit)).toBe(expected);
    });
  });

  describe("limit excludes one full half", () => {
    it("returns input unchanged when no AM cycleIdx is valid (limit forces PM)", () => {
      // limit { min: 13, max: 17 } means only PM hours 13-17 are valid
      // No AM cycleIdx (which gives 0 or 1-11) can land in [13, 17].
      expect(findNearestValidCycleIdx(5, 0, { max: 17, min: 13 })).toBe(5);
    });

    it("returns input unchanged when no PM cycleIdx is valid (limit forces AM)", () => {
      // limit { min: 1, max: 5 } means only AM hours 1-5 are valid; no PM combo works.
      expect(findNearestValidCycleIdx(7, 1, { max: 5, min: 1 })).toBe(7);
    });
  });

  it("respects limit with only min set (max defaults to 23)", () => {
    expect(findNearestValidCycleIdx(0, 0, { min: 12 })).toBe(0); // No AM works; falls through to input
    expect(findNearestValidCycleIdx(0, 1, { min: 12 })).toBe(0); // 12 PM = 12, valid
  });

  it("respects limit with only max set (min defaults to 0)", () => {
    expect(findNearestValidCycleIdx(0, 0, { max: 5 })).toBe(0); // 12 AM = 0, valid
    expect(findNearestValidCycleIdx(11, 0, { max: 5 })).toBe(5);
  });
});
