import React from "react";

import { render } from "@testing-library/react-native";
import type { ReactTestInstance } from "react-test-renderer";

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
  is12HourPicker?: boolean;
  item: string;
  selectedValue?: number;
}) =>
  render(
    <PickerItem
      adjustedLimitedMax={props.adjustedLimitedMax}
      adjustedLimitedMin={props.adjustedLimitedMin}
      allowFontScaling={false}
      amLabel="AM"
      is12HourPicker={props.is12HourPicker}
      item={props.item}
      pmLabel="PM"
      selectedValue={props.selectedValue}
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
});
