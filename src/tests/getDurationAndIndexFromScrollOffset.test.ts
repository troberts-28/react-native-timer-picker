import { getDurationAndIndexFromScrollOffset } from "../utils/getDurationAndIndexFromScrollOffset";

describe("getDurationAndIndexFromScrollOffset", () => {
  describe("infinite scroll disabled", () => {
    it("calculates duration and index at start position", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: true,
        interval: 1,
        itemHeight: 50,
        numberOfItems: 60,
        padWithNItems: 2,
        yContentOffset: 0,
      });
      expect(result).toEqual({ duration: 0, index: 0 });
    });

    it("calculates duration and index at middle position", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: true,
        interval: 1,
        itemHeight: 50,
        numberOfItems: 60,
        padWithNItems: 2,
        yContentOffset: 500,
      });
      expect(result).toEqual({ duration: 10, index: 10 });
    });

    it("calculates duration and index with interval of 5", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: true,
        interval: 5,
        itemHeight: 50,
        numberOfItems: 12,
        padWithNItems: 2,
        yContentOffset: 200,
      });
      expect(result).toEqual({ duration: 20, index: 4 });
    });

    it("calculates duration and index with different item height", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: true,
        interval: 1,
        itemHeight: 40,
        numberOfItems: 60,
        padWithNItems: 2,
        yContentOffset: 200,
      });
      expect(result).toEqual({ duration: 5, index: 5 });
    });

    it("rounds to nearest index", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: true,
        interval: 1,
        itemHeight: 50,
        numberOfItems: 60,
        padWithNItems: 2,
        yContentOffset: 127,
      });
      expect(result).toEqual({ duration: 3, index: 3 }); // 127/50 = 2.54, rounds to 3
    });

    it("handles wrap-around at max value", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: true,
        interval: 1,
        itemHeight: 50,
        numberOfItems: 24,
        padWithNItems: 2,
        yContentOffset: 1200,
      });
      expect(result).toEqual({ duration: 0, index: 24 }); // 24 % 24 = 0
    });
  });

  describe("infinite scroll enabled", () => {
    it("calculates duration and index at start position", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: false,
        interval: 1,
        itemHeight: 50,
        numberOfItems: 60,
        padWithNItems: 2,
        yContentOffset: 0,
      });
      expect(result).toEqual({ duration: 2, index: 0 });
    });

    it("accounts for padding offset in infinite scroll", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: false,
        interval: 1,
        itemHeight: 50,
        numberOfItems: 60,
        padWithNItems: 2,
        yContentOffset: 100,
      });
      expect(result).toEqual({ duration: 4, index: 2 });
    });

    it("calculates duration with larger padding", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: false,
        interval: 1,
        itemHeight: 50,
        numberOfItems: 60,
        padWithNItems: 5,
        yContentOffset: 0,
      });
      expect(result).toEqual({ duration: 5, index: 0 });
    });

    it("handles modulo wrap-around correctly", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: false,
        interval: 1,
        itemHeight: 50,
        numberOfItems: 24,
        padWithNItems: 2,
        yContentOffset: 1100,
      });
      expect(result).toEqual({ duration: 0, index: 22 }); // (22 + 2) % 24 = 0, wraps to duration 0
    });

    it("calculates with interval of 15", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: false,
        interval: 15,
        itemHeight: 50,
        numberOfItems: 4,
        padWithNItems: 2,
        yContentOffset: 100,
      });
      expect(result).toEqual({ duration: 0, index: 2 }); // (2 + 2) % 4 = 0, 0 * 15 = 0
    });
  });

  describe("different intervals", () => {
    it("handles interval of 1", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: true,
        interval: 1,
        itemHeight: 50,
        numberOfItems: 60,
        padWithNItems: 2,
        yContentOffset: 300,
      });
      expect(result).toEqual({ duration: 6, index: 6 });
    });

    it("handles interval of 5", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: true,
        interval: 5,
        itemHeight: 50,
        numberOfItems: 12,
        padWithNItems: 2,
        yContentOffset: 300,
      });
      expect(result).toEqual({ duration: 30, index: 6 });
    });

    it("handles interval of 15 for minutes", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: true,
        interval: 15,
        itemHeight: 50,
        numberOfItems: 4,
        padWithNItems: 2,
        yContentOffset: 150,
      });
      expect(result).toEqual({ duration: 45, index: 3 });
    });

    it("handles interval of 10", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: true,
        interval: 10,
        itemHeight: 50,
        numberOfItems: 6,
        padWithNItems: 2,
        yContentOffset: 100,
      });
      expect(result).toEqual({ duration: 20, index: 2 });
    });
  });

  describe("different item heights", () => {
    it("handles item height of 30", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: true,
        interval: 1,
        itemHeight: 30,
        numberOfItems: 60,
        padWithNItems: 2,
        yContentOffset: 180,
      });
      expect(result).toEqual({ duration: 6, index: 6 });
    });

    it("handles item height of 60", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: true,
        interval: 1,
        itemHeight: 60,
        numberOfItems: 60,
        padWithNItems: 2,
        yContentOffset: 360,
      });
      expect(result).toEqual({ duration: 6, index: 6 });
    });

    it("handles item height of 100", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: true,
        interval: 1,
        itemHeight: 100,
        numberOfItems: 60,
        padWithNItems: 2,
        yContentOffset: 500,
      });
      expect(result).toEqual({ duration: 5, index: 5 });
    });
  });

  describe("rounding behavior", () => {
    it("rounds down when closer to lower index", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: true,
        interval: 1,
        itemHeight: 50,
        numberOfItems: 60,
        padWithNItems: 2,
        yContentOffset: 124,
      });
      expect(result).toEqual({ duration: 2, index: 2 }); // 124/50 = 2.48
    });

    it("rounds up when closer to upper index", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: true,
        interval: 1,
        itemHeight: 50,
        numberOfItems: 60,
        padWithNItems: 2,
        yContentOffset: 126,
      });
      expect(result).toEqual({ duration: 3, index: 3 }); // 126/50 = 2.52
    });

    it("rounds to nearest for exact halfway point", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: true,
        interval: 1,
        itemHeight: 50,
        numberOfItems: 60,
        padWithNItems: 2,
        yContentOffset: 125,
      });
      expect(result).toEqual({ duration: 3, index: 3 }); // 125/50 = 2.5, rounds to 3
    });
  });

  describe("edge cases", () => {
    it("handles zero offset", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: true,
        interval: 1,
        itemHeight: 50,
        numberOfItems: 60,
        padWithNItems: 2,
        yContentOffset: 0,
      });
      expect(result).toEqual({ duration: 0, index: 0 });
    });

    it("handles very large offset", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: true,
        interval: 1,
        itemHeight: 50,
        numberOfItems: 24,
        padWithNItems: 2,
        yContentOffset: 5000,
      });
      expect(result.index).toBe(100);
      expect(result.duration).toBe(4); // (100 % 24) * 1 = 4
    });

    it("handles small numberOfItems", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: true,
        interval: 1,
        itemHeight: 50,
        numberOfItems: 2,
        padWithNItems: 1,
        yContentOffset: 150,
      });
      expect(result).toEqual({ duration: 1, index: 3 }); // 3 % 2 = 1
    });

    it("handles no padding", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: false,
        interval: 1,
        itemHeight: 50,
        numberOfItems: 60,
        padWithNItems: 0,
        yContentOffset: 100,
      });
      expect(result).toEqual({ duration: 2, index: 2 });
    });
  });

  describe("real-world scenarios", () => {
    it("handles typical hour picker scroll", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: false,
        interval: 1,
        itemHeight: 50,
        numberOfItems: 24,
        padWithNItems: 2,
        yContentOffset: 600,
      });
      expect(result).toEqual({ duration: 14, index: 12 }); // (12 + 2) % 24 = 14
    });

    it("handles typical minute picker scroll", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: false,
        interval: 1,
        itemHeight: 50,
        numberOfItems: 60,
        padWithNItems: 2,
        yContentOffset: 1500,
      });
      expect(result).toEqual({ duration: 32, index: 30 }); // (30 + 2) % 60 = 32
    });

    it("handles minute picker with 5-minute interval", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: false,
        interval: 5,
        itemHeight: 50,
        numberOfItems: 12,
        padWithNItems: 2,
        yContentOffset: 250,
      });
      expect(result).toEqual({ duration: 35, index: 5 }); // (5 + 2) % 12 = 7, 7 * 5 = 35
    });

    it("handles second picker scroll", () => {
      const result = getDurationAndIndexFromScrollOffset({
        disableInfiniteScroll: true,
        interval: 1,
        itemHeight: 40,
        numberOfItems: 60,
        padWithNItems: 2,
        yContentOffset: 800,
      });
      expect(result).toEqual({ duration: 20, index: 20 });
    });
  });
});
