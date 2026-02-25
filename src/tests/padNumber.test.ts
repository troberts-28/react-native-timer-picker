import { padNumber } from "../utils/padNumber";

describe("padNumber", () => {
  describe("padding with zero", () => {
    it("pads single digit with zero", () => {
      expect(padNumber(0, { padWithZero: true })).toBe("00");
      expect(padNumber(1, { padWithZero: true })).toBe("01");
      expect(padNumber(5, { padWithZero: true })).toBe("05");
      expect(padNumber(9, { padWithZero: true })).toBe("09");
    });

    it("does not pad double digits", () => {
      expect(padNumber(10, { padWithZero: true })).toBe("10");
      expect(padNumber(15, { padWithZero: true })).toBe("15");
      expect(padNumber(99, { padWithZero: true })).toBe("99");
    });

    it("does not pad triple digits", () => {
      expect(padNumber(100, { padWithZero: true })).toBe("100");
      expect(padNumber(255, { padWithZero: true })).toBe("255");
      expect(padNumber(999, { padWithZero: true })).toBe("999");
    });

    it("handles very large numbers", () => {
      expect(padNumber(1000, { padWithZero: true })).toBe("1000");
      expect(padNumber(99999, { padWithZero: true })).toBe("99999");
    });
  });

  describe("padding with space", () => {
    it("pads single digit with space", () => {
      expect(padNumber(0, { padWithZero: false })).toBe("\u20070");
      expect(padNumber(1, { padWithZero: false })).toBe("\u20071");
      expect(padNumber(5, { padWithZero: false })).toBe("\u20075");
      expect(padNumber(9, { padWithZero: false })).toBe("\u20079");
    });

    it("does not pad double digits", () => {
      expect(padNumber(10, { padWithZero: false })).toBe("10");
      expect(padNumber(15, { padWithZero: false })).toBe("15");
      expect(padNumber(99, { padWithZero: false })).toBe("99");
    });

    it("does not pad triple digits", () => {
      expect(padNumber(100, { padWithZero: false })).toBe("100");
      expect(padNumber(255, { padWithZero: false })).toBe("255");
      expect(padNumber(999, { padWithZero: false })).toBe("999");
    });

    it("handles very large numbers", () => {
      expect(padNumber(1000, { padWithZero: false })).toBe("1000");
      expect(padNumber(99999, { padWithZero: false })).toBe("99999");
    });
  });

  describe("no options provided", () => {
    it("defaults to space padding for single digits", () => {
      expect(padNumber(0)).toBe("\u20070");
      expect(padNumber(1)).toBe("\u20071");
      expect(padNumber(5)).toBe("\u20075");
      expect(padNumber(9)).toBe("\u20079");
    });

    it("does not pad double digits", () => {
      expect(padNumber(10)).toBe("10");
      expect(padNumber(15)).toBe("15");
      expect(padNumber(99)).toBe("99");
    });

    it("does not pad triple digits", () => {
      expect(padNumber(100)).toBe("100");
      expect(padNumber(255)).toBe("255");
      expect(padNumber(999)).toBe("999");
    });
  });

  describe("undefined padWithZero option", () => {
    it("defaults to space padding", () => {
      expect(padNumber(0, {})).toBe("\u20070");
      expect(padNumber(5, {})).toBe("\u20075");
      expect(padNumber(9, {})).toBe("\u20079");
    });

    it("does not pad double digits", () => {
      expect(padNumber(10, {})).toBe("10");
      expect(padNumber(50, {})).toBe("50");
    });
  });

  describe("edge cases at boundary", () => {
    it("handles value exactly 9 (last single digit)", () => {
      expect(padNumber(9, { padWithZero: true })).toBe("09");
      expect(padNumber(9, { padWithZero: false })).toBe("\u20079");
      expect(padNumber(9)).toBe("\u20079");
    });

    it("handles value exactly 10 (first double digit)", () => {
      expect(padNumber(10, { padWithZero: true })).toBe("10");
      expect(padNumber(10, { padWithZero: false })).toBe("10");
      expect(padNumber(10)).toBe("10");
    });

    it("handles value exactly 0", () => {
      expect(padNumber(0, { padWithZero: true })).toBe("00");
      expect(padNumber(0, { padWithZero: false })).toBe("\u20070");
      expect(padNumber(0)).toBe("\u20070");
    });
  });

  describe("real-world scenarios", () => {
    it("formats hours for 12-hour display", () => {
      expect(padNumber(1, { padWithZero: true })).toBe("01");
      expect(padNumber(12, { padWithZero: true })).toBe("12");
    });

    it("formats hours for 24-hour display", () => {
      expect(padNumber(0, { padWithZero: true })).toBe("00");
      expect(padNumber(9, { padWithZero: true })).toBe("09");
      expect(padNumber(23, { padWithZero: true })).toBe("23");
    });

    it("formats minutes", () => {
      expect(padNumber(0, { padWithZero: true })).toBe("00");
      expect(padNumber(5, { padWithZero: true })).toBe("05");
      expect(padNumber(30, { padWithZero: true })).toBe("30");
      expect(padNumber(59, { padWithZero: true })).toBe("59");
    });

    it("formats seconds", () => {
      expect(padNumber(0, { padWithZero: true })).toBe("00");
      expect(padNumber(9, { padWithZero: true })).toBe("09");
      expect(padNumber(45, { padWithZero: true })).toBe("45");
      expect(padNumber(59, { padWithZero: true })).toBe("59");
    });

    it("formats days without padding preference", () => {
      expect(padNumber(1, { padWithZero: false })).toBe("\u20071");
      expect(padNumber(7, { padWithZero: false })).toBe("\u20077");
      expect(padNumber(30, { padWithZero: false })).toBe("30");
      expect(padNumber(365, { padWithZero: false })).toBe("365");
    });
  });

  describe("all single digits", () => {
    it("correctly pads all single digits 0-9 with zero", () => {
      for (let i = 0; i < 10; i++) {
        const result = padNumber(i, { padWithZero: true });
        expect(result).toBe(`0${i}`);
        expect(result).toHaveLength(2);
      }
    });

    it("correctly pads all single digits 0-9 with space", () => {
      for (let i = 0; i < 10; i++) {
        const result = padNumber(i, { padWithZero: false });
        expect(result).toBe(`\u2007${i}`);
        expect(result).toHaveLength(2);
      }
    });
  });

  describe("return type", () => {
    it("always returns a string", () => {
      expect(typeof padNumber(0, { padWithZero: true })).toBe("string");
      expect(typeof padNumber(5, { padWithZero: true })).toBe("string");
      expect(typeof padNumber(10, { padWithZero: true })).toBe("string");
      expect(typeof padNumber(100, { padWithZero: true })).toBe("string");
    });
  });

  describe("string length", () => {
    it("returns 2-character string for single digits", () => {
      expect(padNumber(0, { padWithZero: true })).toHaveLength(2);
      expect(padNumber(5, { padWithZero: true })).toHaveLength(2);
      expect(padNumber(9, { padWithZero: true })).toHaveLength(2);
    });

    it("returns 2-character string for single digits with space", () => {
      expect(padNumber(0, { padWithZero: false })).toHaveLength(2);
      expect(padNumber(5, { padWithZero: false })).toHaveLength(2);
      expect(padNumber(9, { padWithZero: false })).toHaveLength(2);
    });

    it("returns correct length for double digits", () => {
      expect(padNumber(10, { padWithZero: true })).toHaveLength(2);
      expect(padNumber(50, { padWithZero: true })).toHaveLength(2);
      expect(padNumber(99, { padWithZero: true })).toHaveLength(2);
    });

    it("returns correct length for triple digits", () => {
      expect(padNumber(100, { padWithZero: true })).toHaveLength(3);
      expect(padNumber(500, { padWithZero: true })).toHaveLength(3);
      expect(padNumber(999, { padWithZero: true })).toHaveLength(3);
    });
  });
});
