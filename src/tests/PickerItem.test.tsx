import React from "react";

import { render } from "@testing-library/react-native";
import type { ReactTestInstance } from "react-test-renderer";

import type { Limit } from "../components/DurationScroll/types";
import PickerItem from "../components/PickerItem";
import type { generateStyles } from "../components/TimerPicker/styles";

const styles = {
  disabledPickerContainer: {},
  disabledPickerItem: { opacity: 0.3 },
  pickerAmPmContainer: {},
  pickerAmPmLabel: {},
  pickerContainer: {},
  pickerGradientOverlay: {},
  pickerItem: {},
  pickerItemContainer: {},
  pickerLabel: {},
  pickerLabelContainer: {},
  selectedPickerItem: { fontWeight: "bold" as const },
} as ReturnType<typeof generateStyles>;

const renderItem = (props: {
  adjustedLimitedMax: number;
  adjustedLimitedMin: number;
  amLabel?: string;
  combinedHourLimit?: Limit;
  currentAmPm?: number;
  is12HourPicker?: boolean;
  isAmPmPicker?: boolean;
  item: string;
  pmLabel?: string;
  selectedValue?: number;
  separateAmPmPicker?: boolean;
}) =>
  render(
    <PickerItem
      adjustedLimitedMax={props.adjustedLimitedMax}
      adjustedLimitedMin={props.adjustedLimitedMin}
      allowFontScaling={false}
      amLabel={props.amLabel ?? "AM"}
      combinedHourLimit={props.combinedHourLimit}
      currentAmPm={props.currentAmPm}
      is12HourPicker={props.is12HourPicker}
      isAmPmPicker={props.isAmPmPicker}
      item={props.item}
      pmLabel={props.pmLabel ?? "PM"}
      selectedValue={props.selectedValue}
      separateAmPmPicker={props.separateAmPmPicker}
      styles={styles}
    />
  );

type Style = { fontWeight?: string; opacity?: number };

const flattenStyle = (element: ReactTestInstance): Style[] => {
  const style = (element.props as { style?: Style | Style[] }).style;
  if (!style) return [];
  return (Array.isArray(style) ? style : [style]).filter(Boolean);
};

const isDisabledStyle = (element: ReactTestInstance) =>
  flattenStyle(element).some((s) => s.opacity === 0.3);

const isSelectedStyle = (element: ReactTestInstance) =>
  flattenStyle(element).some((s) => s.fontWeight === "bold");

describe("PickerItem", () => {
  describe("12-hour picker greying", () => {
    it("greys out PM hours that fall outside a normal limit (regression for issue #82)", () => {
      // 9 AM - 5 PM range; 6 PM should be greyed
      const { getByText } = renderItem({
        adjustedLimitedMax: 17,
        adjustedLimitedMin: 9,
        is12HourPicker: true,
        item: "06 PM",
      });
      expect(isDisabledStyle(getByText("06"))).toBe(true);
    });

    it("does not grey PM hours that fall inside a normal limit", () => {
      const { getByText } = renderItem({
        adjustedLimitedMax: 17,
        adjustedLimitedMin: 9,
        is12HourPicker: true,
        item: "01 PM",
      });
      expect(isDisabledStyle(getByText("01"))).toBe(false);
    });

    it("does not grey AM hours inside a wraparound (cross-midnight) limit", () => {
      // 8 PM through 5 AM next day → wraparound limit
      const { getByText } = renderItem({
        adjustedLimitedMax: 5,
        adjustedLimitedMin: 20,
        is12HourPicker: true,
        item: "01 AM",
      });
      expect(isDisabledStyle(getByText("01"))).toBe(false);
    });

    it("greys AM hours outside a wraparound limit", () => {
      const { getByText } = renderItem({
        adjustedLimitedMax: 5,
        adjustedLimitedMin: 20,
        is12HourPicker: true,
        item: "06 AM",
      });
      expect(isDisabledStyle(getByText("06"))).toBe(true);
    });

    it("does not grey 12 AM (midnight) inside a wraparound limit", () => {
      const { getByText } = renderItem({
        adjustedLimitedMax: 5,
        adjustedLimitedMin: 20,
        is12HourPicker: true,
        item: "12 AM",
      });
      expect(isDisabledStyle(getByText("12"))).toBe(false);
    });

    it("does not grey 12 PM (noon) inside a normal AM-PM limit", () => {
      const { getByText } = renderItem({
        adjustedLimitedMax: 17,
        adjustedLimitedMin: 9,
        is12HourPicker: true,
        item: "12 PM",
      });
      expect(isDisabledStyle(getByText("12"))).toBe(false);
    });
  });

  describe("12-hour picker selection", () => {
    it("marks 01 AM as selected when selectedValue is 1", () => {
      const { getByText } = renderItem({
        adjustedLimitedMax: 5,
        adjustedLimitedMin: 20,
        is12HourPicker: true,
        item: "01 AM",
        selectedValue: 1,
      });
      expect(isSelectedStyle(getByText("01"))).toBe(true);
    });

    it("marks 01 PM as selected when selectedValue is 13", () => {
      const { getByText } = renderItem({
        adjustedLimitedMax: 23,
        adjustedLimitedMin: 0,
        is12HourPicker: true,
        item: "01 PM",
        selectedValue: 13,
      });
      expect(isSelectedStyle(getByText("01"))).toBe(true);
    });

    it("marks 12 AM as selected when selectedValue is 0", () => {
      const { getByText } = renderItem({
        adjustedLimitedMax: 23,
        adjustedLimitedMin: 0,
        is12HourPicker: true,
        item: "12 AM",
        selectedValue: 0,
      });
      expect(isSelectedStyle(getByText("12"))).toBe(true);
    });
  });

  describe("non-12-hour picker", () => {
    it("greys values above max", () => {
      const { getByText } = renderItem({
        adjustedLimitedMax: 25,
        adjustedLimitedMin: 0,
        item: "30",
      });
      expect(isDisabledStyle(getByText("30"))).toBe(true);
    });

    it("does not grey values inside the range", () => {
      const { getByText } = renderItem({
        adjustedLimitedMax: 30,
        adjustedLimitedMin: 10,
        item: "20",
      });
      expect(isDisabledStyle(getByText("20"))).toBe(false);
    });
  });

  describe("12-hour cycle picker (separate AM/PM)", () => {
    it("marks '12' as selected when selectedValue is 0", () => {
      const { getByText } = renderItem({
        adjustedLimitedMax: 11,
        adjustedLimitedMin: 0,
        is12HourPicker: true,
        item: "12",
        selectedValue: 0,
        separateAmPmPicker: true,
      });
      expect(isSelectedStyle(getByText("12"))).toBe(true);
    });

    it("does not mark '12' as selected when selectedValue is 12", () => {
      const { getByText } = renderItem({
        adjustedLimitedMax: 11,
        adjustedLimitedMin: 0,
        is12HourPicker: true,
        item: "12",
        selectedValue: 12,
        separateAmPmPicker: true,
      });
      expect(isSelectedStyle(getByText("12"))).toBe(false);
    });

    it("marks '03' as selected when selectedValue is 3", () => {
      const { getByText } = renderItem({
        adjustedLimitedMax: 11,
        adjustedLimitedMin: 0,
        is12HourPicker: true,
        item: "03",
        selectedValue: 3,
        separateAmPmPicker: true,
      });
      expect(isSelectedStyle(getByText("03"))).toBe(true);
    });

    it("does not grey items when no combinedHourLimit is provided", () => {
      const { getByText } = renderItem({
        adjustedLimitedMax: 5,
        adjustedLimitedMin: 0,
        currentAmPm: 0,
        is12HourPicker: true,
        item: "11",
        separateAmPmPicker: true,
      });
      expect(isDisabledStyle(getByText("11"))).toBe(false);
    });

    describe("greying with normal hourLimit { min: 9, max: 17 }", () => {
      const limit = { max: 17, min: 9 };

      it.each([
        ["12", 0, true], // 12 AM = 0, out of range
        ["08", 0, true],
        ["09", 0, false],
        ["11", 0, false],
      ])("AM (currentAmPm=0): row %s greyed=%s", (row, currentAmPm, greyed) => {
        const { getByText } = renderItem({
          adjustedLimitedMax: 11,
          adjustedLimitedMin: 0,
          combinedHourLimit: limit,
          currentAmPm,
          is12HourPicker: true,
          item: row,
          separateAmPmPicker: true,
        });
        expect(isDisabledStyle(getByText(row))).toBe(greyed);
      });

      it.each([
        ["12", 1, false], // 12 PM = 12, in range
        ["05", 1, false], // 5 PM = 17, in range
        ["06", 1, true], // 6 PM = 18, out of range
        ["11", 1, true],
      ])("PM (currentAmPm=1): row %s greyed=%s", (row, currentAmPm, greyed) => {
        const { getByText } = renderItem({
          adjustedLimitedMax: 11,
          adjustedLimitedMin: 0,
          combinedHourLimit: limit,
          currentAmPm,
          is12HourPicker: true,
          item: row,
          separateAmPmPicker: true,
        });
        expect(isDisabledStyle(getByText(row))).toBe(greyed);
      });
    });

    describe("greying with wraparound hourLimit { min: 20, max: 5 }", () => {
      const limit = { max: 5, min: 20 };

      it.each([
        ["12", 0, false], // 12 AM = 0, in range
        ["05", 0, false], // 5 AM = 5, in range
        ["06", 0, true], // 6 AM = 6, out of range
        ["11", 0, true],
      ])("AM (currentAmPm=0): row %s greyed=%s", (row, currentAmPm, greyed) => {
        const { getByText } = renderItem({
          adjustedLimitedMax: 11,
          adjustedLimitedMin: 0,
          combinedHourLimit: limit,
          currentAmPm,
          is12HourPicker: true,
          item: row,
          separateAmPmPicker: true,
        });
        expect(isDisabledStyle(getByText(row))).toBe(greyed);
      });

      it.each([
        ["12", 1, true], // 12 PM = 12, out of range
        ["07", 1, true],
        ["08", 1, false], // 8 PM = 20, in range
        ["11", 1, false], // 11 PM = 23, in range
      ])("PM (currentAmPm=1): row %s greyed=%s", (row, currentAmPm, greyed) => {
        const { getByText } = renderItem({
          adjustedLimitedMax: 11,
          adjustedLimitedMin: 0,
          combinedHourLimit: limit,
          currentAmPm,
          is12HourPicker: true,
          item: row,
          separateAmPmPicker: true,
        });
        expect(isDisabledStyle(getByText(row))).toBe(greyed);
      });
    });
  });

  describe("AM/PM picker", () => {
    it("marks AM as selected when selectedValue is 0", () => {
      const { getByText } = renderItem({
        adjustedLimitedMax: 1,
        adjustedLimitedMin: 0,
        isAmPmPicker: true,
        item: "AM",
        selectedValue: 0,
      });
      expect(isSelectedStyle(getByText("AM"))).toBe(true);
    });

    it("marks PM as selected when selectedValue is 1", () => {
      const { getByText } = renderItem({
        adjustedLimitedMax: 1,
        adjustedLimitedMin: 0,
        isAmPmPicker: true,
        item: "PM",
        selectedValue: 1,
      });
      expect(isSelectedStyle(getByText("PM"))).toBe(true);
    });

    it("does not mark PM as selected when selectedValue is 0", () => {
      const { getByText } = renderItem({
        adjustedLimitedMax: 1,
        adjustedLimitedMin: 0,
        isAmPmPicker: true,
        item: "PM",
        selectedValue: 0,
      });
      expect(isSelectedStyle(getByText("PM"))).toBe(false);
    });

    it("respects custom amLabel/pmLabel for matching", () => {
      const { getByText } = renderItem({
        adjustedLimitedMax: 1,
        adjustedLimitedMin: 0,
        amLabel: "오전",
        isAmPmPicker: true,
        item: "오전",
        pmLabel: "오후",
        selectedValue: 0,
      });
      expect(isSelectedStyle(getByText("오전"))).toBe(true);
    });

    describe("greying is disabled (AM/PM is always freely toggleable)", () => {
      // The AM/PM column is intentionally limit-free so the user can always toggle
      // halves to reach any valid hour. The hour column does the limit enforcement.
      it.each([
        ["AM", { max: 17, min: 9 }],
        ["PM", { max: 17, min: 9 }],
        ["AM", { max: 5, min: 20 }],
        ["PM", { max: 5, min: 20 }],
      ])("row %s is never greyed", (row, limit) => {
        const { getByText } = renderItem({
          adjustedLimitedMax: 1,
          adjustedLimitedMin: 0,
          combinedHourLimit: limit,
          isAmPmPicker: true,
          item: row,
        });
        expect(isDisabledStyle(getByText(row))).toBe(false);
      });
    });
  });
});
