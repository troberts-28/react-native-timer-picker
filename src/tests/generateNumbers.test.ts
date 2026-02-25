import { generateNumbers, generate12HourNumbers } from "../utils/generateNumbers";

describe("generateNumbers", () => {
  describe("basic functionality", () => {
    it("generates correct number of items", () => {
      const result = generateNumbers(10, {
        disableInfiniteScroll: true,
        interval: 1,
        padWithNItems: 0,
        repeatNTimes: 1,
      });
      expect(result).toHaveLength(10);
    });

    it("generates numbers with correct interval", () => {
      const result = generateNumbers(5, {
        disableInfiniteScroll: true,
        interval: 2,
        padWithNItems: 0,
        repeatNTimes: 1,
      });
      expect(result).toEqual(["\u20070", "\u20072", "\u20074", "\u20076", "\u20078"]);
    });

    it("generates numbers with interval of 5", () => {
      const result = generateNumbers(4, {
        disableInfiniteScroll: true,
        interval: 5,
        padWithNItems: 0,
        repeatNTimes: 1,
      });
      expect(result).toEqual(["\u20070", "\u20075", "10", "15"]);
    });

    it("returns empty array when numberOfItems is 0", () => {
      const result = generateNumbers(0, {
        interval: 1,
        padWithNItems: 0,
        repeatNTimes: 1,
      });
      expect(result).toEqual([]);
    });

    it("returns empty array when numberOfItems is negative", () => {
      const result = generateNumbers(-5, {
        interval: 1,
        padWithNItems: 0,
        repeatNTimes: 1,
      });
      expect(result).toEqual([]);
    });
  });

  describe("padding with zeros", () => {
    it("pads single-digit numbers with zeros", () => {
      const result = generateNumbers(5, {
        disableInfiniteScroll: true,
        interval: 1,
        padNumbersWithZero: true,
        padWithNItems: 0,
        repeatNTimes: 1,
      });
      expect(result).toEqual(["00", "01", "02", "03", "04"]);
    });

    it("does not pad double-digit numbers", () => {
      const result = generateNumbers(15, {
        disableInfiniteScroll: true,
        interval: 1,
        padNumbersWithZero: true,
        padWithNItems: 0,
        repeatNTimes: 1,
      });
      expect(result[0]).toBe("00");
      expect(result[9]).toBe("09");
      expect(result[10]).toBe("10");
      expect(result[14]).toBe("14");
    });

    it("pads with space when padNumbersWithZero is false", () => {
      const result = generateNumbers(5, {
        disableInfiniteScroll: true,
        interval: 1,
        padNumbersWithZero: false,
        padWithNItems: 0,
        repeatNTimes: 1,
      });
      expect(result).toEqual(["\u20070", "\u20071", "\u20072", "\u20073", "\u20074"]);
    });
  });

  describe("padding with empty items", () => {
    it("adds padding items at start and end when infinite scroll is disabled", () => {
      const result = generateNumbers(3, {
        disableInfiniteScroll: true,
        interval: 1,
        padWithNItems: 2,
        repeatNTimes: 1,
      });
      expect(result).toEqual(["", "", "\u20070", "\u20071", "\u20072", "", ""]);
      expect(result).toHaveLength(7);
    });

    it("adds padding with 1 item", () => {
      const result = generateNumbers(3, {
        disableInfiniteScroll: true,
        interval: 1,
        padWithNItems: 1,
        repeatNTimes: 1,
      });
      expect(result).toEqual(["", "\u20070", "\u20071", "\u20072", ""]);
    });

    it("adds padding with 3 items", () => {
      const result = generateNumbers(2, {
        disableInfiniteScroll: true,
        interval: 1,
        padWithNItems: 3,
        repeatNTimes: 1,
      });
      expect(result).toEqual(["", "", "", "\u20070", "\u20071", "", "", ""]);
    });
  });

  describe("number repetition", () => {
    it("repeats numbers when repeatNTimes is 2", () => {
      const result = generateNumbers(3, {
        disableInfiniteScroll: false,
        interval: 1,
        padWithNItems: 0,
        repeatNTimes: 2,
      });
      expect(result).toEqual(["\u20070", "\u20071", "\u20072", "\u20070", "\u20071", "\u20072"]);
    });

    it("repeats numbers when repeatNTimes is 3", () => {
      const result = generateNumbers(2, {
        disableInfiniteScroll: false,
        interval: 1,
        padWithNItems: 0,
        repeatNTimes: 3,
      });
      expect(result).toEqual(["\u20070", "\u20071", "\u20070", "\u20071", "\u20070", "\u20071"]);
    });
  });

  describe("combined options", () => {
    it("combines padding with zeros and empty items", () => {
      const result = generateNumbers(3, {
        disableInfiniteScroll: true,
        interval: 1,
        padNumbersWithZero: true,
        padWithNItems: 1,
        repeatNTimes: 1,
      });
      expect(result).toEqual(["", "00", "01", "02", ""]);
    });

    it("combines interval, padding with zeros, and repetition", () => {
      const result = generateNumbers(3, {
        disableInfiniteScroll: false,
        interval: 5,
        padNumbersWithZero: true,
        padWithNItems: 0,
        repeatNTimes: 2,
      });
      expect(result).toEqual(["00", "05", "10", "00", "05", "10"]);
    });

    it("handles all options together", () => {
      const result = generateNumbers(3, {
        disableInfiniteScroll: false,
        interval: 2,
        padNumbersWithZero: true,
        padWithNItems: 1,
        repeatNTimes: 2,
      });
      expect(result).toEqual(["00", "02", "04", "00", "02", "04"]);
    });
  });
});

describe("generate12HourNumbers", () => {
  describe("basic functionality", () => {
    it("generates all 24 hours with 1-hour interval", () => {
      const result = generate12HourNumbers({
        disableInfiniteScroll: false,
        interval: 1,
        padWithNItems: 0,
      });
      expect(result).toHaveLength(24);
      expect(result[0]).toBe("12 AM");
      expect(result[11]).toBe("11 AM");
      expect(result[12]).toBe("12 PM");
      expect(result[23]).toBe("11 PM");
    });

    it("generates hours with 2-hour interval", () => {
      const result = generate12HourNumbers({
        disableInfiniteScroll: false,
        interval: 2,
        padWithNItems: 0,
      });
      expect(result).toHaveLength(12);
      expect(result[0]).toBe("12 AM");
      expect(result[5]).toBe("10 AM");
      expect(result[6]).toBe("12 PM");
      expect(result[11]).toBe("10 PM");
    });

    it("generates hours with 3-hour interval", () => {
      const result = generate12HourNumbers({
        disableInfiniteScroll: false,
        interval: 3,
        padWithNItems: 0,
      });
      expect(result).toHaveLength(8);
      expect(result[0]).toBe("12 AM");
      expect(result[3]).toBe("\u20079 AM");
      expect(result[4]).toBe("12 PM");
      expect(result[7]).toBe("\u20079 PM");
    });

    it("generates hours with 4-hour interval", () => {
      const result = generate12HourNumbers({
        disableInfiniteScroll: false,
        interval: 4,
        padWithNItems: 0,
      });
      expect(result).toHaveLength(6);
      expect(result[0]).toBe("12 AM");
      expect(result[2]).toBe("\u20078 AM");
      expect(result[3]).toBe("12 PM");
      expect(result[5]).toBe("\u20078 PM");
    });

    it("generates hours with 6-hour interval", () => {
      const result = generate12HourNumbers({
        disableInfiniteScroll: false,
        interval: 6,
        padWithNItems: 0,
      });
      expect(result).toHaveLength(4);
      expect(result[0]).toBe("12 AM");
      expect(result[1]).toBe("\u20076 AM");
      expect(result[2]).toBe("12 PM");
      expect(result[3]).toBe("\u20076 PM");
    });
  });

  describe("padding with zeros", () => {
    it("pads hours with zeros", () => {
      const result = generate12HourNumbers({
        disableInfiniteScroll: false,
        interval: 1,
        padNumbersWithZero: true,
        padWithNItems: 0,
      });
      expect(result[0]).toBe("12 AM");
      expect(result[1]).toBe("01 AM");
      expect(result[9]).toBe("09 AM");
      expect(result[10]).toBe("10 AM");
      expect(result[12]).toBe("12 PM");
    });

    it("handles 12-hour format correctly with zero padding", () => {
      const result = generate12HourNumbers({
        disableInfiniteScroll: false,
        interval: 1,
        padNumbersWithZero: true,
        padWithNItems: 0,
      });
      expect(result[12]).toBe("12 PM"); // 12 PM should not be 00 PM
      expect(result[13]).toBe("01 PM");
    });
  });

  describe("padding with empty items", () => {
    it("adds padding at start and end when infinite scroll is disabled", () => {
      const result = generate12HourNumbers({
        disableInfiniteScroll: true,
        interval: 6,
        padWithNItems: 2,
      });
      expect(result[0]).toBe("");
      expect(result[1]).toBe("");
      expect(result[2]).toBe("12 AM");
      expect(result[3]).toBe("\u20076 AM");
      expect(result[4]).toBe("12 PM");
      expect(result[5]).toBe("\u20076 PM");
      expect(result[6]).toBe("");
      expect(result[7]).toBe("");
      expect(result).toHaveLength(8);
    });

    it("does not add padding when infinite scroll is enabled", () => {
      const result = generate12HourNumbers({
        disableInfiniteScroll: false,
        interval: 6,
        padWithNItems: 2,
      });
      expect(result[0]).toBe("12 AM");
      expect(result[3]).toBe("\u20076 PM");
      expect(result).toHaveLength(4);
    });
  });

  describe("number repetition", () => {
    it("repeats hours when repeatNTimes is 2", () => {
      const result = generate12HourNumbers({
        disableInfiniteScroll: false,
        interval: 6,
        padWithNItems: 0,
        repeatNTimes: 2,
      });
      expect(result).toHaveLength(8);
      expect(result[0]).toBe("12 AM");
      expect(result[3]).toBe("\u20076 PM");
      expect(result[4]).toBe("12 AM");
      expect(result[7]).toBe("\u20076 PM");
    });

    it("repeats hours when repeatNTimes is 3", () => {
      const result = generate12HourNumbers({
        disableInfiniteScroll: false,
        interval: 12,
        padWithNItems: 0,
        repeatNTimes: 3,
      });
      expect(result).toHaveLength(6);
      expect(result[0]).toBe("12 AM");
      expect(result[1]).toBe("12 PM");
      expect(result[2]).toBe("12 AM");
      expect(result[3]).toBe("12 PM");
      expect(result[4]).toBe("12 AM");
      expect(result[5]).toBe("12 PM");
    });

    it("defaults to repeatNTimes of 1 when not provided", () => {
      const result = generate12HourNumbers({
        disableInfiniteScroll: false,
        interval: 12,
        padWithNItems: 0,
      });
      expect(result).toHaveLength(2);
    });
  });

  describe("combined options", () => {
    it("combines padding with zeros and empty items", () => {
      const result = generate12HourNumbers({
        disableInfiniteScroll: true,
        interval: 12,
        padNumbersWithZero: true,
        padWithNItems: 1,
      });
      expect(result).toEqual(["", "12 AM", "12 PM", ""]);
    });

    it("combines all options", () => {
      const result = generate12HourNumbers({
        disableInfiniteScroll: false,
        interval: 6,
        padNumbersWithZero: true,
        padWithNItems: 1,
        repeatNTimes: 2,
      });
      expect(result).toHaveLength(8);
      expect(result[0]).toBe("12 AM");
      expect(result[1]).toBe("06 AM");
      expect(result[2]).toBe("12 PM");
      expect(result[3]).toBe("06 PM");
      expect(result[4]).toBe("12 AM");
      expect(result[7]).toBe("06 PM");
    });
  });
});
