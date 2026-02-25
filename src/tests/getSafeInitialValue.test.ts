/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSafeInitialValue } from "../utils/getSafeInitialValue";

describe("getSafeInitialValue", () => {
  describe("valid values", () => {
    it("returns all values when all are valid", () => {
      const result = getSafeInitialValue({
        days: 5,
        hours: 10,
        minutes: 30,
        seconds: 45,
      });
      expect(result).toEqual({
        days: 5,
        hours: 10,
        minutes: 30,
        seconds: 45,
      });
    });

    it("handles zero values", () => {
      const result = getSafeInitialValue({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
      expect(result).toEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    });

    it("handles large values", () => {
      const result = getSafeInitialValue({
        days: 365,
        hours: 23,
        minutes: 59,
        seconds: 59,
      });
      expect(result).toEqual({
        days: 365,
        hours: 23,
        minutes: 59,
        seconds: 59,
      });
    });

    it("handles negative values as valid numbers", () => {
      const result = getSafeInitialValue({
        days: -5,
        hours: -2,
        minutes: -30,
        seconds: -15,
      });
      expect(result).toEqual({
        days: -5,
        hours: -2,
        minutes: -30,
        seconds: -15,
      });
    });

    it("handles decimal values", () => {
      const result = getSafeInitialValue({
        days: 1.5,
        hours: 2.7,
        minutes: 30.3,
        seconds: 45.9,
      });
      expect(result).toEqual({
        days: 1.5,
        hours: 2.7,
        minutes: 30.3,
        seconds: 45.9,
      });
    });
  });

  describe("undefined input", () => {
    it("returns all zeros when input is undefined", () => {
      const result = getSafeInitialValue(undefined);
      expect(result).toEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    });
  });

  describe("partial values", () => {
    it("defaults missing days to 0", () => {
      const result = getSafeInitialValue({
        hours: 10,
        minutes: 30,
        seconds: 45,
      });
      expect(result).toEqual({
        days: 0,
        hours: 10,
        minutes: 30,
        seconds: 45,
      });
    });

    it("defaults missing hours to 0", () => {
      const result = getSafeInitialValue({
        days: 5,
        minutes: 30,
        seconds: 45,
      });
      expect(result).toEqual({
        days: 5,
        hours: 0,
        minutes: 30,
        seconds: 45,
      });
    });

    it("defaults missing minutes to 0", () => {
      const result = getSafeInitialValue({
        days: 5,
        hours: 10,
        seconds: 45,
      });
      expect(result).toEqual({
        days: 5,
        hours: 10,
        minutes: 0,
        seconds: 45,
      });
    });

    it("defaults missing seconds to 0", () => {
      const result = getSafeInitialValue({
        days: 5,
        hours: 10,
        minutes: 30,
      });
      expect(result).toEqual({
        days: 5,
        hours: 10,
        minutes: 30,
        seconds: 0,
      });
    });

    it("handles only days provided", () => {
      const result = getSafeInitialValue({ days: 7 });
      expect(result).toEqual({
        days: 7,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    });

    it("handles only hours provided", () => {
      const result = getSafeInitialValue({ hours: 12 });
      expect(result).toEqual({
        days: 0,
        hours: 12,
        minutes: 0,
        seconds: 0,
      });
    });

    it("handles only minutes provided", () => {
      const result = getSafeInitialValue({ minutes: 45 });
      expect(result).toEqual({
        days: 0,
        hours: 0,
        minutes: 45,
        seconds: 0,
      });
    });

    it("handles only seconds provided", () => {
      const result = getSafeInitialValue({ seconds: 30 });
      expect(result).toEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 30,
      });
    });

    it("handles empty object", () => {
      const result = getSafeInitialValue({});
      expect(result).toEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    });
  });

  describe("invalid values - NaN", () => {
    it("defaults days to 0 when NaN", () => {
      const result = getSafeInitialValue({
        days: NaN,
        hours: 10,
        minutes: 30,
        seconds: 45,
      });
      expect(result).toEqual({
        days: 0,
        hours: 10,
        minutes: 30,
        seconds: 45,
      });
    });

    it("defaults hours to 0 when NaN", () => {
      const result = getSafeInitialValue({
        days: 5,
        hours: NaN,
        minutes: 30,
        seconds: 45,
      });
      expect(result).toEqual({
        days: 5,
        hours: 0,
        minutes: 30,
        seconds: 45,
      });
    });

    it("defaults minutes to 0 when NaN", () => {
      const result = getSafeInitialValue({
        days: 5,
        hours: 10,
        minutes: NaN,
        seconds: 45,
      });
      expect(result).toEqual({
        days: 5,
        hours: 10,
        minutes: 0,
        seconds: 45,
      });
    });

    it("defaults seconds to 0 when NaN", () => {
      const result = getSafeInitialValue({
        days: 5,
        hours: 10,
        minutes: 30,
        seconds: NaN,
      });
      expect(result).toEqual({
        days: 5,
        hours: 10,
        minutes: 30,
        seconds: 0,
      });
    });

    it("defaults all to 0 when all are NaN", () => {
      const result = getSafeInitialValue({
        days: NaN,
        hours: NaN,
        minutes: NaN,
        seconds: NaN,
      });
      expect(result).toEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    });
  });

  describe("invalid values - wrong types", () => {
    it("defaults days to 0 when string", () => {
      const result = getSafeInitialValue({
        days: "5" as any,
        hours: 10,
        minutes: 30,
        seconds: 45,
      });
      expect(result).toEqual({
        days: 0,
        hours: 10,
        minutes: 30,
        seconds: 45,
      });
    });

    it("defaults hours to 0 when string", () => {
      const result = getSafeInitialValue({
        days: 5,
        hours: "10" as any,
        minutes: 30,
        seconds: 45,
      });
      expect(result).toEqual({
        days: 5,
        hours: 0,
        minutes: 30,
        seconds: 45,
      });
    });

    it("defaults minutes to 0 when boolean", () => {
      const result = getSafeInitialValue({
        days: 5,
        hours: 10,
        minutes: true as any,
        seconds: 45,
      });
      expect(result).toEqual({
        days: 5,
        hours: 10,
        minutes: 0,
        seconds: 45,
      });
    });

    it("defaults seconds to 0 when null", () => {
      const result = getSafeInitialValue({
        days: 5,
        hours: 10,
        minutes: 30,
        seconds: null as any,
      });
      expect(result).toEqual({
        days: 5,
        hours: 10,
        minutes: 30,
        seconds: 0,
      });
    });

    it("defaults all to 0 when all are invalid types", () => {
      const result = getSafeInitialValue({
        days: "invalid" as any,
        hours: true as any,
        minutes: null as any,
        seconds: undefined as any,
      });
      expect(result).toEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    });

    it("defaults values to 0 when objects", () => {
      const result = getSafeInitialValue({
        days: {} as any,
        hours: [] as any,
        minutes: { value: 30 } as any,
        seconds: [45] as any,
      });
      expect(result).toEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    });
  });

  describe("mixed valid and invalid values", () => {
    it("handles mix of valid and NaN values", () => {
      const result = getSafeInitialValue({
        days: 5,
        hours: NaN,
        minutes: 30,
        seconds: NaN,
      });
      expect(result).toEqual({
        days: 5,
        hours: 0,
        minutes: 30,
        seconds: 0,
      });
    });

    it("handles mix of valid and undefined values", () => {
      const result = getSafeInitialValue({
        days: 5,
        minutes: 30,
      });
      expect(result).toEqual({
        days: 5,
        hours: 0,
        minutes: 30,
        seconds: 0,
      });
    });

    it("handles mix of valid and invalid type values", () => {
      const result = getSafeInitialValue({
        days: 5,
        hours: "invalid" as any,
        minutes: 30,
        seconds: null as any,
      });
      expect(result).toEqual({
        days: 5,
        hours: 0,
        minutes: 30,
        seconds: 0,
      });
    });
  });

  describe("special number values", () => {
    it("handles Infinity", () => {
      const result = getSafeInitialValue({
        days: Infinity,
        hours: -Infinity,
        minutes: 30,
        seconds: 45,
      });
      expect(result).toEqual({
        days: Infinity,
        hours: -Infinity,
        minutes: 30,
        seconds: 45,
      });
    });

    it("handles very small numbers", () => {
      const result = getSafeInitialValue({
        days: 0.00001,
        hours: 0.00002,
        minutes: 0.00003,
        seconds: 0.00004,
      });
      expect(result).toEqual({
        days: 0.00001,
        hours: 0.00002,
        minutes: 0.00003,
        seconds: 0.00004,
      });
    });

    it("handles very large numbers", () => {
      const result = getSafeInitialValue({
        days: 999999,
        hours: 999999,
        minutes: 999999,
        seconds: 999999,
      });
      expect(result).toEqual({
        days: 999999,
        hours: 999999,
        minutes: 999999,
        seconds: 999999,
      });
    });
  });

  describe("real-world scenarios", () => {
    it("handles typical timer value", () => {
      const result = getSafeInitialValue({
        hours: 2,
        minutes: 30,
        seconds: 0,
      });
      expect(result).toEqual({
        days: 0,
        hours: 2,
        minutes: 30,
        seconds: 0,
      });
    });

    it("handles countdown timer", () => {
      const result = getSafeInitialValue({
        minutes: 5,
        seconds: 0,
      });
      expect(result).toEqual({
        days: 0,
        hours: 0,
        minutes: 5,
        seconds: 0,
      });
    });

    it("handles duration with days", () => {
      const result = getSafeInitialValue({
        days: 7,
        hours: 12,
        minutes: 30,
        seconds: 45,
      });
      expect(result).toEqual({
        days: 7,
        hours: 12,
        minutes: 30,
        seconds: 45,
      });
    });

    it("handles invalid user input gracefully", () => {
      const result = getSafeInitialValue({
        days: parseInt("abc"),
        hours: parseInt(""),
        minutes: parseFloat("not a number"),
        seconds: 30,
      });
      expect(result).toEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 30,
      });
    });
  });
});
