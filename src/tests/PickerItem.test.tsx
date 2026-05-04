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
  selectedSeparateAmPmItem: {},
  separateAmPmItem: {},
} as ReturnType<typeof generateStyles>;

const renderItem = (props: {
  adjustedLimitedMax: number;
  adjustedLimitedMin: number;
  amLabel?: string;
  is12HourPicker?: boolean;
  isAmPmPicker?: boolean;
  isItemDisabled?: (value: number) => boolean;
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
      is12HourPicker={props.is12HourPicker}
      isAmPmPicker={props.isAmPmPicker}
      isItemDisabled={props.isItemDisabled}
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

    it("falls back to column-local limit when no isItemDisabled callback is provided", () => {
      // In actual usage, the cycle hour column receives limit={undefined}, so
      // adjustedLimited covers 0..11 and no row is greyed by default.
      const { getByText } = renderItem({
        adjustedLimitedMax: 11,
        adjustedLimitedMin: 0,
        is12HourPicker: true,
        item: "11",
        separateAmPmPicker: true,
      });
      expect(isDisabledStyle(getByText("11"))).toBe(false);
    });

    describe("greying via isItemDisabled callback", () => {
      it("calls isItemDisabled with the parsed cycleIdx ('12' → 0)", () => {
        const isItemDisabled = jest.fn((value: number) => value === 0);
        const { getByText } = renderItem({
          adjustedLimitedMax: 11,
          adjustedLimitedMin: 0,
          is12HourPicker: true,
          isItemDisabled,
          item: "12",
          separateAmPmPicker: true,
        });
        expect(isItemDisabled).toHaveBeenCalledWith(0);
        expect(isDisabledStyle(getByText("12"))).toBe(true);
      });

      it("calls isItemDisabled with the parsed cycleIdx ('05' → 5)", () => {
        const isItemDisabled = jest.fn(() => false);
        const { getByText } = renderItem({
          adjustedLimitedMax: 11,
          adjustedLimitedMin: 0,
          is12HourPicker: true,
          isItemDisabled,
          item: "05",
          separateAmPmPicker: true,
        });
        expect(isItemDisabled).toHaveBeenCalledWith(5);
        expect(isDisabledStyle(getByText("05"))).toBe(false);
      });

      it("greys when callback returns true, not when false", () => {
        const { getByText: a } = renderItem({
          adjustedLimitedMax: 11,
          adjustedLimitedMin: 0,
          is12HourPicker: true,
          isItemDisabled: () => true,
          item: "07",
          separateAmPmPicker: true,
        });
        expect(isDisabledStyle(a("07"))).toBe(true);

        const { getByText: b } = renderItem({
          adjustedLimitedMax: 11,
          adjustedLimitedMin: 0,
          is12HourPicker: true,
          isItemDisabled: () => false,
          item: "07",
          separateAmPmPicker: true,
        });
        expect(isDisabledStyle(b("07"))).toBe(false);
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

    describe("custom AM/PM styling", () => {
      const customStyles = {
        ...styles,
        selectedSeparateAmPmItem: { color: "tomato" } as const,
        separateAmPmItem: { fontSize: 14 } as const,
      } as ReturnType<typeof generateStyles>;

      const renderWithCustom = (props: Parameters<typeof renderItem>[0]) =>
        render(
          <PickerItem
            adjustedLimitedMax={props.adjustedLimitedMax}
            adjustedLimitedMin={props.adjustedLimitedMin}
            allowFontScaling={false}
            amLabel={props.amLabel ?? "AM"}
            isAmPmPicker={props.isAmPmPicker}
            item={props.item}
            pmLabel={props.pmLabel ?? "PM"}
            selectedValue={props.selectedValue}
            styles={customStyles}
          />
        );

      it("applies separateAmPmItem to AM/PM rows", () => {
        const { getByText } = renderWithCustom({
          adjustedLimitedMax: 1,
          adjustedLimitedMin: 0,
          isAmPmPicker: true,
          item: "AM",
        });
        const flat = (getByText("AM").props.style as Array<Record<string, unknown>>).flat();
        expect(flat.some((s) => s && s.fontSize === 14)).toBe(true);
      });

      it("applies selectedSeparateAmPmItem only to the selected AM/PM row", () => {
        const { getByText: getSelected } = renderWithCustom({
          adjustedLimitedMax: 1,
          adjustedLimitedMin: 0,
          isAmPmPicker: true,
          item: "AM",
          selectedValue: 0,
        });
        const selectedFlat = (
          getSelected("AM").props.style as Array<Record<string, unknown>>
        ).flat();
        expect(selectedFlat.some((s) => s && s.color === "tomato")).toBe(true);

        const { getByText: getUnselected } = renderWithCustom({
          adjustedLimitedMax: 1,
          adjustedLimitedMin: 0,
          isAmPmPicker: true,
          item: "PM",
          selectedValue: 0,
        });
        const unselectedFlat = (
          getUnselected("PM").props.style as Array<Record<string, unknown>>
        ).flat();
        expect(unselectedFlat.some((s) => s && s.color === "tomato")).toBe(false);
      });

      it("does not apply separateAmPmItem to non-AM/PM rows", () => {
        const { getByText } = renderWithCustom({
          adjustedLimitedMax: 11,
          adjustedLimitedMin: 0,
          item: "05",
        });
        const flat = (getByText("05").props.style as Array<Record<string, unknown>>).flat();
        expect(flat.some((s) => s && s.fontSize === 14)).toBe(false);
      });
    });

    describe("greying is disabled (AM/PM is always freely toggleable)", () => {
      // The AM/PM column is intentionally limit-free so the user can always toggle
      // halves to reach any valid hour. The hour column does the limit enforcement.
      // Even with an isItemDisabled callback that always returns true, AM/PM rows
      // never grey.
      it.each([["AM"], ["PM"]])("row %s is never greyed", (row) => {
        const { getByText } = renderItem({
          adjustedLimitedMax: 1,
          adjustedLimitedMin: 0,
          isAmPmPicker: true,
          isItemDisabled: () => true,
          item: row,
        });
        expect(isDisabledStyle(getByText(row))).toBe(false);
      });
    });
  });
});
