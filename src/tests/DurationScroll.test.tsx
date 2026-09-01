import React from "react";

import { fireEvent, render, within } from "@testing-library/react-native";
import { AccessibilityInfo } from "react-native";

import DurationScroll from "../components/DurationScroll";
import type { generateStyles } from "../components/TimerPicker/styles";

describe("DurationScroll", () => {
  const onDurationChangeMock = jest.fn();
  const emptyStyles = {
    disabledPickerContainer: {},
    disabledPickerItem: {},
    pickerAmPmContainer: {},
    pickerAmPmLabel: {},
    pickerContainer: {},
    pickerGradientOverlay: {},
    pickerItem: {},
    pickerItemContainer: {},
    pickerLabel: {},
    pickerLabelContainer: {},
    selectedSeparateAmPmItem: {},
    separateAmPmItem: {},
  } as ReturnType<typeof generateStyles>;

  it("renders without crashing", () => {
    const { getByTestId } = render(
      <DurationScroll
        aggressivelyGetLatestDuration={false}
        interval={1}
        maximumValue={1}
        onDurationChange={onDurationChangeMock}
        padWithNItems={0}
        repeatNumbersNTimesNotExplicitlySet={true}
        styles={emptyStyles}
        testID="duration-scroll"
      />
    );
    const component = getByTestId("duration-scroll");
    expect(component).toBeDefined();
  });

  it("renders the correct number of items", () => {
    const { getAllByTestId } = render(
      <DurationScroll
        aggressivelyGetLatestDuration={false}
        interval={1}
        maximumValue={23}
        onDurationChange={onDurationChangeMock}
        padWithNItems={1}
        repeatNumbersNTimesNotExplicitlySet={true}
        styles={emptyStyles}
      />
    );
    const items = getAllByTestId("picker-item");
    expect(items).toHaveLength(10);
  });

  it("renders the label if provided", () => {
    const { getByText } = render(
      <DurationScroll
        aggressivelyGetLatestDuration={false}
        interval={1}
        label="Duration"
        maximumValue={59}
        onDurationChange={onDurationChangeMock}
        padWithNItems={1}
        repeatNumbersNTimesNotExplicitlySet={true}
        styles={emptyStyles}
      />
    );
    const label = getByText("Duration");
    expect(label).toBeDefined();
  });

  it("does not render label when not provided", () => {
    const { queryByTestId } = render(
      <DurationScroll
        aggressivelyGetLatestDuration={false}
        interval={1}
        maximumValue={59}
        onDurationChange={onDurationChangeMock}
        padWithNItems={1}
        repeatNumbersNTimesNotExplicitlySet={true}
        styles={emptyStyles}
      />
    );
    const label = queryByTestId("picker-label");
    expect(label).toBeNull();
  });

  it("handles different intervals", () => {
    const { getAllByTestId } = render(
      <DurationScroll
        aggressivelyGetLatestDuration={false}
        interval={5}
        maximumValue={55}
        onDurationChange={onDurationChangeMock}
        padWithNItems={1}
        repeatNumbersNTimesNotExplicitlySet={true}
        styles={emptyStyles}
      />
    );
    const items = getAllByTestId("picker-item");
    expect(items).toBeDefined();
  });

  it("renders with zero padWithNItems", () => {
    const { getByTestId } = render(
      <DurationScroll
        aggressivelyGetLatestDuration={false}
        interval={1}
        maximumValue={59}
        onDurationChange={onDurationChangeMock}
        padWithNItems={0}
        repeatNumbersNTimesNotExplicitlySet={true}
        styles={emptyStyles}
        testID="duration-scroll"
      />
    );
    const component = getByTestId("duration-scroll");
    expect(component).toBeDefined();
  });

  it("handles large maximumValue", () => {
    const { getByTestId } = render(
      <DurationScroll
        aggressivelyGetLatestDuration={false}
        interval={1}
        maximumValue={999}
        onDurationChange={onDurationChangeMock}
        padWithNItems={1}
        repeatNumbersNTimesNotExplicitlySet={true}
        styles={emptyStyles}
        testID="duration-scroll"
      />
    );
    const component = getByTestId("duration-scroll");
    expect(component).toBeDefined();
  });

  it("handles aggressivelyGetLatestDuration set to true", () => {
    const { getByTestId } = render(
      <DurationScroll
        aggressivelyGetLatestDuration={true}
        interval={1}
        maximumValue={59}
        onDurationChange={onDurationChangeMock}
        padWithNItems={1}
        repeatNumbersNTimesNotExplicitlySet={true}
        styles={emptyStyles}
        testID="duration-scroll"
      />
    );
    const component = getByTestId("duration-scroll");
    expect(component).toBeDefined();
  });

  it("handles repeatNumbersNTimesNotExplicitlySet set to false", () => {
    const { getByTestId } = render(
      <DurationScroll
        aggressivelyGetLatestDuration={false}
        interval={1}
        maximumValue={59}
        onDurationChange={onDurationChangeMock}
        padWithNItems={1}
        repeatNumbersNTimesNotExplicitlySet={false}
        styles={emptyStyles}
        testID="duration-scroll"
      />
    );
    const component = getByTestId("duration-scroll");
    expect(component).toBeDefined();
  });

  describe("accessibility", () => {
    const scrollStyles = {
      ...emptyStyles,
      pickerItemContainer: { height: 50 },
    } as ReturnType<typeof generateStyles>;

    let announceSpy: jest.SpyInstance;

    beforeEach(() => {
      announceSpy = jest
        .spyOn(AccessibilityInfo, "announceForAccessibility")
        .mockImplementation(() => {});
      onDurationChangeMock.mockClear();
    });

    afterEach(() => {
      announceSpy.mockRestore();
    });

    const renderColumn = (props: Record<string, unknown> = {}) =>
      render(
        <DurationScroll
          aggressivelyGetLatestDuration={false}
          interval={1}
          maximumValue={59}
          onDurationChange={onDurationChangeMock}
          padWithNItems={1}
          repeatNumbersNTimesNotExplicitlySet={true}
          styles={scrollStyles}
          testID="duration-scroll"
          {...props}
        />
      );

    const adjust = (element: ReturnType<typeof renderColumn>, actionName: string) =>
      fireEvent(element.getByTestId("duration-scroll"), "accessibilityAction", {
        nativeEvent: { actionName },
      });

    it("exposes the column as a single adjustable element", () => {
      const { getByTestId } = renderColumn({ accessibilityLabel: "Minutes" });
      const column = getByTestId("duration-scroll").props;

      expect(column.accessible).toBe(true);
      expect(column.accessibilityRole).toBe("adjustable");
      expect(column.accessibilityLabel).toBe("Minutes");
      expect(column.accessibilityActions).toEqual([{ name: "increment" }, { name: "decrement" }]);
    });

    it("passes the hint through", () => {
      const { getByTestId } = renderColumn({ accessibilityHint: "Swipe to change" });
      expect(getByTestId("duration-scroll").props.accessibilityHint).toBe("Swipe to change");
    });

    it("hides the rows from screen readers so the column is one element", () => {
      const { getByTestId } = renderColumn();
      const list = within(getByTestId("duration-scroll")).getByTestId("duration-scroll-flatlist");

      expect(list.props.accessible).toBe(false);
      expect(list.props.importantForAccessibility).toBe("no-hide-descendants");
    });

    it("announces the selected value", () => {
      const { getByTestId } = renderColumn({ selectedValue: 30 });
      expect(getByTestId("duration-scroll").props.accessibilityValue).toEqual({ text: "30" });
    });

    it("falls back to the initial value before anything is selected", () => {
      const { getByTestId } = renderColumn({ initialValue: 12 });
      expect(getByTestId("duration-scroll").props.accessibilityValue).toEqual({ text: "12" });
    });

    it("increments from the current value, not from zero", () => {
      // regression: the action used to read a ref that was never seeded, so the first
      // increment on a picker showing 30 announced 1
      const element = renderColumn({ initialValue: 30, selectedValue: 30 });
      adjust(element, "increment");

      expect(onDurationChangeMock).toHaveBeenCalledWith(31);
      expect(announceSpy).toHaveBeenCalledWith("31");
    });

    it("decrements from the current value", () => {
      const element = renderColumn({ initialValue: 30, selectedValue: 30 });
      adjust(element, "decrement");

      expect(onDurationChangeMock).toHaveBeenCalledWith(29);
      expect(announceSpy).toHaveBeenCalledWith("29");
    });

    it("steps by the interval", () => {
      const element = renderColumn({ initialValue: 30, interval: 5, selectedValue: 30 });
      adjust(element, "increment");

      expect(onDurationChangeMock).toHaveBeenCalledWith(35);
    });

    it("ignores actions it does not handle", () => {
      const element = renderColumn({ selectedValue: 30 });
      adjust(element, "activate");

      expect(onDurationChangeMock).not.toHaveBeenCalled();
    });

    describe("when disabled", () => {
      it("reports the disabled state", () => {
        const { getByTestId } = renderColumn({ isDisabled: true });
        expect(getByTestId("duration-scroll").props.accessibilityState).toEqual({ disabled: true });
      });

      it("does not adjust the value", () => {
        const element = renderColumn({ initialValue: 30, isDisabled: true, selectedValue: 30 });
        adjust(element, "increment");

        expect(onDurationChangeMock).not.toHaveBeenCalled();
        expect(announceSpy).not.toHaveBeenCalled();
      });
    });

    describe("limits", () => {
      it("never moves outside a normal range", () => {
        const element = renderColumn({
          initialValue: 17,
          limit: { max: 17, min: 9 },
          selectedValue: 17,
        });
        adjust(element, "increment");

        expect(onDurationChangeMock).toHaveBeenCalledWith(9);
      });

      it("never moves outside a wraparound range", () => {
        // 8 PM through 5 AM: incrementing at 5 must cross to 20, not stall or land in the gap
        const element = renderColumn({
          initialValue: 5,
          limit: { max: 5, min: 20 },
          maximumValue: 23,
          selectedValue: 5,
        });
        adjust(element, "increment");

        expect(onDurationChangeMock).toHaveBeenCalledWith(20);
      });

      it("stops at the boundary when the column cannot loop", () => {
        const element = renderColumn({
          disableInfiniteScroll: true,
          initialValue: 17,
          limit: { max: 17, min: 9 },
          selectedValue: 17,
        });
        adjust(element, "increment");

        expect(onDurationChangeMock).not.toHaveBeenCalled();
      });
    });

    it("keeps the announced value in step with a normal scroll", () => {
      // regression: the announced value used to be held in state only the accessibility
      // action wrote to, so it went stale as soon as the user dragged the column
      const { getByTestId, rerender } = renderColumn({ selectedValue: 0 });
      const list = within(getByTestId("duration-scroll")).getByTestId("duration-scroll-flatlist");

      fireEvent(list, "momentumScrollEnd", { nativeEvent: { contentOffset: { y: 1450 } } });
      expect(onDurationChangeMock).toHaveBeenCalledWith(30);

      rerender(
        <DurationScroll
          aggressivelyGetLatestDuration={false}
          interval={1}
          maximumValue={59}
          onDurationChange={onDurationChangeMock}
          padWithNItems={1}
          repeatNumbersNTimesNotExplicitlySet={true}
          selectedValue={30}
          styles={scrollStyles}
          testID="duration-scroll"
        />
      );

      expect(getByTestId("duration-scroll").props.accessibilityValue).toEqual({ text: "30" });
    });
  });
});
