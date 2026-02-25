import { colorToRgba } from "../utils/colorToRgba";

describe("colorToRgba", () => {
  describe("named colors", () => {
    it("converts 'transparent' to rgba", () => {
      expect(colorToRgba({ color: "transparent" })).toBe("rgba(0, 0, 0, 0)");
    });

    it("converts 'black' to rgba", () => {
      expect(colorToRgba({ color: "black" })).toBe("rgba(0, 0, 0, 1)");
    });

    it("converts 'white' to rgba", () => {
      expect(colorToRgba({ color: "white" })).toBe("rgba(255, 255, 255, 1)");
    });

    it("converts 'blue' to rgba", () => {
      expect(colorToRgba({ color: "blue" })).toBe("rgba(0, 0, 255, 1)");
    });

    it("converts 'green' to rgba", () => {
      expect(colorToRgba({ color: "green" })).toBe("rgba(0, 128, 0, 1)");
    });

    it("converts 'gray' to rgba", () => {
      expect(colorToRgba({ color: "gray" })).toBe("rgba(128, 128, 128, 1)");
    });

    it("converts 'red' to rgba", () => {
      expect(colorToRgba({ color: "red" })).toBe("rgba(255, 0, 0, 1)");
    });
  });

  describe("RGB format", () => {
    it("converts rgb color to rgba with default opacity", () => {
      expect(colorToRgba({ color: "rgb(255, 0, 0)" })).toBe("rgba(255, 0, 0, 1)");
    });

    it("converts rgb color to rgba with custom opacity", () => {
      expect(colorToRgba({ color: "rgb(255, 0, 0)", opacity: 0.5 })).toBe("rgba(255, 0, 0, 0.5)");
    });

    it("converts rgb color with spaces", () => {
      expect(colorToRgba({ color: "rgb(128, 64, 32)" })).toBe("rgba(128, 64, 32, 1)");
    });

    it("converts rgb color with no spaces", () => {
      expect(colorToRgba({ color: "rgb(128,64,32)" })).toBe("rgba(128, 64, 32, 1)");
    });

    it("handles rgb with zero values", () => {
      expect(colorToRgba({ color: "rgb(0, 0, 0)" })).toBe("rgba(0, 0, 0, 1)");
    });

    it("handles rgb with max values", () => {
      expect(colorToRgba({ color: "rgb(255, 255, 255)" })).toBe("rgba(255, 255, 255, 1)");
    });
  });

  describe("hex format", () => {
    it("converts 6-digit hex color to rgba", () => {
      expect(colorToRgba({ color: "#FF0000" })).toBe("rgba(255, 0, 0, 1)");
    });

    it("converts 6-digit hex color with custom opacity", () => {
      expect(colorToRgba({ color: "#FF0000", opacity: 0.7 })).toBe("rgba(255, 0, 0, 0.7)");
    });

    it("converts 3-digit hex color to rgba", () => {
      expect(colorToRgba({ color: "#F00" })).toBe("rgba(255, 0, 0, 1)");
    });

    it("converts 3-digit hex color with custom opacity", () => {
      expect(colorToRgba({ color: "#F00", opacity: 0.3 })).toBe("rgba(255, 0, 0, 0.3)");
    });

    it("converts lowercase hex color", () => {
      expect(colorToRgba({ color: "#ff0000" })).toBe("rgba(255, 0, 0, 1)");
    });

    it("converts mixed case hex color", () => {
      expect(colorToRgba({ color: "#Ff00Aa" })).toBe("rgba(255, 0, 170, 1)");
    });

    it("converts hex black", () => {
      expect(colorToRgba({ color: "#000000" })).toBe("rgba(0, 0, 0, 1)");
    });

    it("converts hex white", () => {
      expect(colorToRgba({ color: "#FFFFFF" })).toBe("rgba(255, 255, 255, 1)");
    });

    it("converts 3-digit gray hex", () => {
      expect(colorToRgba({ color: "#888" })).toBe("rgba(136, 136, 136, 1)");
    });
  });

  describe("opacity handling", () => {
    it("uses opacity 1 when not provided", () => {
      expect(colorToRgba({ color: "#FF0000" })).toBe("rgba(255, 0, 0, 1)");
    });

    it("handles opacity 0", () => {
      expect(colorToRgba({ color: "#FF0000", opacity: 0 })).toBe("rgba(255, 0, 0, 0)");
    });

    it("handles opacity 1", () => {
      expect(colorToRgba({ color: "#FF0000", opacity: 1 })).toBe("rgba(255, 0, 0, 1)");
    });

    it("handles decimal opacity", () => {
      expect(colorToRgba({ color: "#FF0000", opacity: 0.42 })).toBe("rgba(255, 0, 0, 0.42)");
    });

    it("ignores opacity for named color 'transparent'", () => {
      expect(colorToRgba({ color: "transparent", opacity: 0.5 })).toBe("rgba(0, 0, 0, 0)");
    });
  });

  describe("edge cases", () => {
    it("returns original color for unknown format", () => {
      const unknownColor = "hsl(120, 100%, 50%)";
      expect(colorToRgba({ color: unknownColor })).toBe(unknownColor);
    });

    it("returns original color for invalid named color", () => {
      const invalidColor = "magenta";
      expect(colorToRgba({ color: invalidColor })).toBe(invalidColor);
    });

    it("returns original color for malformed hex", () => {
      const malformedHex = "#GG0000";
      expect(colorToRgba({ color: malformedHex })).toBe(malformedHex);
    });
  });
});
