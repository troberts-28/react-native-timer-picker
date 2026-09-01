import {
  formatAmPmAccessibilityValue,
  formatHour12AccessibilityValue,
  formatHourSlotAccessibilityValue,
} from "../utils/formatAccessibilityValue";

describe("formatHour12AccessibilityValue", () => {
  it.each([
    [0, "12 am"],
    [1, "1 am"],
    [11, "11 am"],
    [12, "12 pm"],
    [13, "1 pm"],
    [17, "5 pm"],
    [23, "11 pm"],
  ])("announces %i as %s", (hour24, expected) => {
    expect(formatHour12AccessibilityValue(hour24, "am", "pm")).toBe(expected);
  });

  it("uses the picker's am/pm labels", () => {
    expect(formatHour12AccessibilityValue(17, "AM", "PM")).toBe("5 PM");
    expect(formatHour12AccessibilityValue(5, "vm", "nm")).toBe("5 vm");
  });

  it("does not pad the hour", () => {
    expect(formatHour12AccessibilityValue(5, "am", "pm")).toBe("5 am");
  });
});

describe("formatHourSlotAccessibilityValue", () => {
  it("announces slot 0 as 12", () => {
    expect(formatHourSlotAccessibilityValue(0)).toBe("12");
  });

  it.each([[1], [5], [11]])("announces slot %i unchanged", (hourSlot) => {
    expect(formatHourSlotAccessibilityValue(hourSlot)).toBe(String(hourSlot));
  });

  it("does not pad the hour", () => {
    expect(formatHourSlotAccessibilityValue(5)).toBe("5");
  });
});

describe("formatAmPmAccessibilityValue", () => {
  it("announces 0 as am and 1 as pm", () => {
    expect(formatAmPmAccessibilityValue(0, "am", "pm")).toBe("am");
    expect(formatAmPmAccessibilityValue(1, "am", "pm")).toBe("pm");
  });

  it("uses the picker's am/pm labels", () => {
    expect(formatAmPmAccessibilityValue(1, "AM", "PM")).toBe("PM");
  });
});
