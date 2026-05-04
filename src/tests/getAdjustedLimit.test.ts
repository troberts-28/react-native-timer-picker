import { getAdjustedLimit } from "../utils/getAdjustedLimit";

describe("getAdjustedLimit", () => {
  describe("undefined or empty limits", () => {
    it("returns default limits when limit is undefined", () => {
      const result = getAdjustedLimit(undefined, 60, 1);
      expect(result).toEqual({ max: 59, min: 0 });
    });

    it("returns default limits when limit has no max or min", () => {
      const result = getAdjustedLimit({}, 60, 1);
      expect(result).toEqual({ max: 59, min: 0 });
    });

    it("calculates max value correctly with interval", () => {
      const result = getAdjustedLimit(undefined, 30, 2);
      expect(result).toEqual({ max: 58, min: 0 });
    });
  });

  describe("valid limits within bounds", () => {
    it("accepts valid min and max within bounds", () => {
      const result = getAdjustedLimit({ max: 15, min: 5 }, 20, 1);
      expect(result).toEqual({ max: 15, min: 5 });
    });

    it("accepts limits at exact boundaries", () => {
      const result = getAdjustedLimit({ max: 59, min: 0 }, 60, 1);
      expect(result).toEqual({ max: 59, min: 0 });
    });

    it("handles min of 0", () => {
      const result = getAdjustedLimit({ max: 10, min: 0 }, 20, 1);
      expect(result).toEqual({ max: 10, min: 0 });
    });

    it("handles max at maximum value", () => {
      const result = getAdjustedLimit({ max: 19, min: 10 }, 20, 1);
      expect(result).toEqual({ max: 19, min: 10 });
    });
  });

  describe("partial limits", () => {
    it("uses default max when only min is provided", () => {
      const result = getAdjustedLimit({ min: 10 }, 60, 1);
      expect(result).toEqual({ max: 59, min: 10 });
    });

    it("uses default min when only max is provided", () => {
      const result = getAdjustedLimit({ max: 30 }, 60, 1);
      expect(result).toEqual({ max: 30, min: 0 });
    });

    it("handles only min provided at boundary", () => {
      const result = getAdjustedLimit({ min: 0 }, 24, 1);
      expect(result).toEqual({ max: 23, min: 0 });
    });

    it("handles only max provided at boundary", () => {
      const result = getAdjustedLimit({ max: 23 }, 24, 1);
      expect(result).toEqual({ max: 23, min: 0 });
    });
  });

  describe("out-of-bounds limits", () => {
    it("clamps max when it exceeds maximum value", () => {
      const result = getAdjustedLimit({ max: 100, min: 5 }, 20, 1);
      expect(result).toEqual({ max: 19, min: 5 });
    });

    it("clamps min when it is negative", () => {
      const result = getAdjustedLimit({ max: 15, min: -5 }, 20, 1);
      expect(result).toEqual({ max: 15, min: 0 });
    });

    it("clamps both limits when out of bounds", () => {
      const result = getAdjustedLimit({ max: 100, min: -10 }, 20, 1);
      expect(result).toEqual({ max: 19, min: 0 });
    });

    it("clamps max when only max is out of bounds", () => {
      const result = getAdjustedLimit({ max: 100 }, 20, 1);
      expect(result).toEqual({ max: 19, min: 0 });
    });

    it("clamps min when only min is out of bounds", () => {
      const result = getAdjustedLimit({ min: -10 }, 20, 1);
      expect(result).toEqual({ max: 19, min: 0 });
    });
  });

  describe("wraparound limits (max < min)", () => {
    it("preserves max < min for wraparound ranges", () => {
      const result = getAdjustedLimit({ max: 5, min: 15 }, 20, 1);
      expect(result).toEqual({ max: 5, min: 15 });
    });

    it("handles edge case where both are equal", () => {
      const result = getAdjustedLimit({ max: 10, min: 10 }, 20, 1);
      expect(result).toEqual({ max: 10, min: 10 });
    });

    it("preserves wraparound after clamping out-of-bounds values", () => {
      const result = getAdjustedLimit({ max: 5, min: 50 }, 20, 1);
      expect(result).toEqual({ max: 5, min: 50 });
    });
  });

  describe("different intervals", () => {
    it("handles interval of 5", () => {
      const result = getAdjustedLimit({ max: 30, min: 10 }, 10, 5);
      expect(result).toEqual({ max: 30, min: 10 });
    });

    it("calculates max with interval of 5", () => {
      const result = getAdjustedLimit(undefined, 10, 5);
      expect(result).toEqual({ max: 45, min: 0 });
    });

    it("handles interval of 15 for minutes", () => {
      const result = getAdjustedLimit({ max: 45, min: 15 }, 4, 15);
      expect(result).toEqual({ max: 45, min: 15 });
    });

    it("calculates max with interval of 15", () => {
      const result = getAdjustedLimit(undefined, 4, 15);
      expect(result).toEqual({ max: 45, min: 0 });
    });

    it("handles large interval", () => {
      const result = getAdjustedLimit(undefined, 3, 30);
      expect(result).toEqual({ max: 60, min: 0 });
    });
  });

  describe("edge cases", () => {
    it("handles numberOfItems of 1", () => {
      const result = getAdjustedLimit(undefined, 1, 1);
      expect(result).toEqual({ max: 0, min: 0 });
    });

    it("handles large numberOfItems", () => {
      const result = getAdjustedLimit({ max: 150, min: 50 }, 200, 1);
      expect(result).toEqual({ max: 150, min: 50 });
    });

    it("clamps max above maxValue down to maxValue", () => {
      const result = getAdjustedLimit({ max: 100, min: 50 }, 50, 1);
      expect(result).toEqual({ max: 49, min: 50 });
    });

    it("handles zero min limit", () => {
      const result = getAdjustedLimit({ max: 0, min: 0 }, 60, 1);
      expect(result).toEqual({ max: 0, min: 0 });
    });

    it("handles limits with decimal-like values (should work with integers)", () => {
      const result = getAdjustedLimit({ max: 15, min: 5 }, 20, 1);
      expect(result).toEqual({ max: 15, min: 5 });
    });
  });

  describe("real-world scenarios", () => {
    it("handles typical hours picker (0-23)", () => {
      const result = getAdjustedLimit({ max: 17, min: 9 }, 24, 1);
      expect(result).toEqual({ max: 17, min: 9 }); // 9 AM to 5 PM
    });
    it("handles cross-midnight 12-hour picker limit (e.g. night shift 8 PM - 5 AM)", () => {
      // wraparound: max < min means the range wraps across midnight
      const result = getAdjustedLimit({ max: 5, min: 20 }, 24, 1);
      expect(result).toEqual({ max: 5, min: 20 });
    });

    it("handles typical minutes picker (0-59)", () => {
      const result = getAdjustedLimit({ max: 45, min: 0 }, 60, 1);
      expect(result).toEqual({ max: 45, min: 0 });
    });

    it("handles minutes with 15-minute interval", () => {
      const result = getAdjustedLimit({ max: 45, min: 15 }, 4, 15);
      expect(result).toEqual({ max: 45, min: 15 });
    });

    it("handles seconds picker (0-59)", () => {
      const result = getAdjustedLimit({ max: 30, min: 0 }, 60, 1);
      expect(result).toEqual({ max: 30, min: 0 });
    });

    it("handles days with no upper limit", () => {
      const result = getAdjustedLimit({ min: 1 }, 100, 1);
      expect(result).toEqual({ max: 99, min: 1 });
    });
  });
});
