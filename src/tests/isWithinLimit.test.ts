import { isWithinLimit } from "../utils/isWithinLimit";

describe("isWithinLimit", () => {
  describe("normal range (min <= max)", () => {
    it("includes values inside the range", () => {
      expect(isWithinLimit(10, 5, 15)).toBe(true);
    });

    it("includes both endpoints", () => {
      expect(isWithinLimit(5, 5, 15)).toBe(true);
      expect(isWithinLimit(15, 5, 15)).toBe(true);
    });

    it("excludes values below min", () => {
      expect(isWithinLimit(4, 5, 15)).toBe(false);
    });

    it("excludes values above max", () => {
      expect(isWithinLimit(16, 5, 15)).toBe(false);
    });

    it("treats min === max as a single allowed value", () => {
      expect(isWithinLimit(7, 7, 7)).toBe(true);
      expect(isWithinLimit(6, 7, 7)).toBe(false);
      expect(isWithinLimit(8, 7, 7)).toBe(false);
    });
  });

  describe("wraparound range (max < min)", () => {
    // 8 PM through 5 AM next day
    const min = 20;
    const max = 5;

    it("includes values at or above min", () => {
      expect(isWithinLimit(20, min, max)).toBe(true);
      expect(isWithinLimit(23, min, max)).toBe(true);
    });

    it("includes values at or below max", () => {
      expect(isWithinLimit(0, min, max)).toBe(true);
      expect(isWithinLimit(5, min, max)).toBe(true);
    });

    it("excludes values strictly between max and min", () => {
      expect(isWithinLimit(6, min, max)).toBe(false);
      expect(isWithinLimit(12, min, max)).toBe(false);
      expect(isWithinLimit(19, min, max)).toBe(false);
    });
  });
});
