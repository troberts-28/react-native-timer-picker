import { getInitialScrollIndex } from "../utils/getInitialScrollIndex";

describe("getInitialScrollIndex", () => {
  describe("infinite scroll disabled", () => {
    it("calculates index for value 0", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: true,
        interval: 1,
        numberOfItems: 60,
        padWithNItems: 2,
        repeatNumbersNTimes: 1,
        value: 0,
      });
      expect(result).toBe(0);
    });

    it("calculates index for middle value", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: true,
        interval: 1,
        numberOfItems: 60,
        padWithNItems: 2,
        repeatNumbersNTimes: 1,
        value: 30,
      });
      expect(result).toBe(30);
    });

    it("calculates index for max value", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: true,
        interval: 1,
        numberOfItems: 60,
        padWithNItems: 2,
        repeatNumbersNTimes: 1,
        value: 59,
      });
      expect(result).toBe(59);
    });

    it("handles interval of 5", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: true,
        interval: 5,
        numberOfItems: 12,
        padWithNItems: 2,
        repeatNumbersNTimes: 1,
        value: 25,
      });
      expect(result).toBe(5); // 25 / 5 = 5
    });

    it("handles interval of 15", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: true,
        interval: 15,
        numberOfItems: 4,
        padWithNItems: 2,
        repeatNumbersNTimes: 1,
        value: 45,
      });
      expect(result).toBe(3); // 45 / 15 = 3
    });

    it("handles different padding values", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: true,
        interval: 1,
        numberOfItems: 24,
        padWithNItems: 5,
        repeatNumbersNTimes: 1,
        value: 12,
      });
      expect(result).toBe(12);
    });
  });

  describe("infinite scroll enabled", () => {
    it("accounts for padding offset at value 0", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: false,
        interval: 1,
        numberOfItems: 60,
        padWithNItems: 2,
        repeatNumbersNTimes: 3,
        value: 0,
      });
      expect(result).toBe(58); // 60 * 1 + 0 - 2 = 58
    });

    it("calculates index with padding offset for middle value", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: false,
        interval: 1,
        numberOfItems: 60,
        padWithNItems: 2,
        repeatNumbersNTimes: 3,
        value: 30,
      });
      expect(result).toBe(88); // 60 * 1 + 30 - 2 = 88
    });

    it("handles larger padding", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: false,
        interval: 1,
        numberOfItems: 60,
        padWithNItems: 5,
        repeatNumbersNTimes: 3,
        value: 15,
      });
      expect(result).toBe(70); // 60 * 1 + 15 - 5 = 70
    });

    it("handles zero padding", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: false,
        interval: 1,
        numberOfItems: 60,
        padWithNItems: 0,
        repeatNumbersNTimes: 3,
        value: 30,
      });
      expect(result).toBe(90); // 60 * 1 + 30 - 0 = 90
    });

    it("handles interval of 5 with padding", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: false,
        interval: 5,
        numberOfItems: 12,
        padWithNItems: 2,
        repeatNumbersNTimes: 3,
        value: 30,
      });
      expect(result).toBe(16); // 12 * 1 + 6 - 2 = 16
    });
  });

  describe("repeat numbers", () => {
    it("positions at middle repetition when repeatNTimes is 3", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: false,
        interval: 1,
        numberOfItems: 24,
        padWithNItems: 2,
        repeatNumbersNTimes: 3,
        value: 12,
      });
      expect(result).toBe(34); // 24 * 1 + 12 - 2 = 34
    });

    it("positions at middle repetition when repeatNTimes is 5", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: false,
        interval: 1,
        numberOfItems: 24,
        padWithNItems: 2,
        repeatNumbersNTimes: 5,
        value: 12,
      });
      expect(result).toBe(58); // 24 * 2 + 12 - 2 = 58
    });

    it("handles even repeatNTimes", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: false,
        interval: 1,
        numberOfItems: 60,
        padWithNItems: 2,
        repeatNumbersNTimes: 4,
        value: 30,
      });
      expect(result).toBe(148); // 60 * 2 + 30 - 2 = 148
    });

    it("handles repeatNTimes of 1", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: false,
        interval: 1,
        numberOfItems: 60,
        padWithNItems: 2,
        repeatNumbersNTimes: 1,
        value: 30,
      });
      expect(result).toBe(28); // 60 * 0 + 30 - 2 = 28
    });

    it("handles large repeatNTimes", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: false,
        interval: 1,
        numberOfItems: 24,
        padWithNItems: 2,
        repeatNumbersNTimes: 7,
        value: 12,
      });
      expect(result).toBe(82); // 24 * 3 + 12 - 2 = 82
    });
  });

  describe("different intervals", () => {
    it("handles interval of 1", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: false,
        interval: 1,
        numberOfItems: 60,
        padWithNItems: 2,
        repeatNumbersNTimes: 3,
        value: 45,
      });
      expect(result).toBe(103); // 60 * 1 + 45 - 2 = 103
    });

    it("handles interval of 5", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: false,
        interval: 5,
        numberOfItems: 12,
        padWithNItems: 2,
        repeatNumbersNTimes: 3,
        value: 35,
      });
      expect(result).toBe(17); // 12 * 1 + 7 - 2 = 17
    });

    it("handles interval of 15", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: false,
        interval: 15,
        numberOfItems: 4,
        padWithNItems: 2,
        repeatNumbersNTimes: 3,
        value: 30,
      });
      expect(result).toBe(4); // 4 * 1 + 2 - 2 = 4
    });

    it("handles interval of 10", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: false,
        interval: 10,
        numberOfItems: 6,
        padWithNItems: 2,
        repeatNumbersNTimes: 3,
        value: 40,
      });
      expect(result).toBe(8); // 6 * 1 + 4 - 2 = 8
    });
  });

  describe("wrap-around behavior", () => {
    it("handles value greater than numberOfItems * interval", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: false,
        interval: 1,
        numberOfItems: 24,
        padWithNItems: 2,
        repeatNumbersNTimes: 3,
        value: 72,
      });
      expect(result).toBe(22); // 24 * 1 + (72 % 24) - 2 = 22
    });

    it("handles negative result from Math.max", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: false,
        interval: 1,
        numberOfItems: 60,
        padWithNItems: 10,
        repeatNumbersNTimes: 1,
        value: 5,
      });
      expect(result).toBe(0); // Math.max(0 + 5 - 10, 0) = 0
    });

    it("ensures non-negative result with large padding", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: false,
        interval: 1,
        numberOfItems: 24,
        padWithNItems: 50,
        repeatNumbersNTimes: 1,
        value: 0,
      });
      expect(result).toBe(0); // Math.max ensures >= 0
    });
  });

  describe("edge cases", () => {
    it("handles value of 0", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: false,
        interval: 1,
        numberOfItems: 60,
        padWithNItems: 2,
        repeatNumbersNTimes: 3,
        value: 0,
      });
      expect(result).toBe(58);
    });

    it("handles small numberOfItems", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: false,
        interval: 1,
        numberOfItems: 2,
        padWithNItems: 1,
        repeatNumbersNTimes: 3,
        value: 1,
      });
      expect(result).toBe(2); // 2 * 1 + 1 - 1 = 2
    });

    it("handles large value", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: false,
        interval: 1,
        numberOfItems: 60,
        padWithNItems: 2,
        repeatNumbersNTimes: 3,
        value: 200,
      });
      expect(result).toBe(78); // 60 * floor(3/2) + ((200 + 60) % 60) - 2 = 60 + 20 - 2 = 78
    });

    it("handles numberOfItems of 1", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: false,
        interval: 1,
        numberOfItems: 1,
        padWithNItems: 0,
        repeatNumbersNTimes: 3,
        value: 0,
      });
      expect(result).toBe(1); // 1 * 1 + 0 - 0 = 1
    });
  });

  describe("real-world scenarios", () => {
    it("handles typical hour picker initialization", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: false,
        interval: 1,
        numberOfItems: 24,
        padWithNItems: 2,
        repeatNumbersNTimes: 3,
        value: 14,
      });
      expect(result).toBe(36); // 24 * 1 + 14 - 2 = 36
    });

    it("handles typical minute picker initialization", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: false,
        interval: 1,
        numberOfItems: 60,
        padWithNItems: 2,
        repeatNumbersNTimes: 3,
        value: 45,
      });
      expect(result).toBe(103); // 60 * 1 + 45 - 2 = 103
    });

    it("handles minute picker with 5-minute interval", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: false,
        interval: 5,
        numberOfItems: 12,
        padWithNItems: 2,
        repeatNumbersNTimes: 3,
        value: 30,
      });
      expect(result).toBe(16); // 12 * 1 + 6 - 2 = 16
    });

    it("handles second picker initialization", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: false,
        interval: 1,
        numberOfItems: 60,
        padWithNItems: 2,
        repeatNumbersNTimes: 3,
        value: 0,
      });
      expect(result).toBe(58); // 60 * 1 + 0 - 2 = 58
    });

    it("handles day picker without repetition", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: true,
        interval: 1,
        numberOfItems: 100,
        padWithNItems: 2,
        repeatNumbersNTimes: 1,
        value: 15,
      });
      expect(result).toBe(15);
    });
  });

  describe("combination scenarios", () => {
    it("combines interval, padding, and repetition", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: false,
        interval: 15,
        numberOfItems: 4,
        padWithNItems: 3,
        repeatNumbersNTimes: 5,
        value: 45,
      });
      expect(result).toBe(8); // 4 * 2 + 3 - 3 = 8
    });

    it("handles disabled infinite scroll with repetition", () => {
      const result = getInitialScrollIndex({
        disableInfiniteScroll: true,
        interval: 5,
        numberOfItems: 12,
        padWithNItems: 5,
        repeatNumbersNTimes: 3,
        value: 35,
      });
      expect(result).toBe(19); // 12 * 1 + 7 = 19
    });
  });
});
