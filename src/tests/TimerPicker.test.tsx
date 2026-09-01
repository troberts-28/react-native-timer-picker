/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { act, render, within } from "@testing-library/react-native";
import { FlatList } from "react-native";

import TimerPicker from "../components/TimerPicker";
import type { TimerPickerRef } from "../components/TimerPicker";

describe("TimerPicker", () => {
  it("renders without crashing", () => {
    const { getByTestId } = render(<TimerPicker />);
    const component = getByTestId("timer-picker");
    expect(component).toBeDefined();
  });

  it("renders without crashing with negative padWithNItems", () => {
    const { getByTestId } = render(<TimerPicker padWithNItems={-1} />);
    const component = getByTestId("timer-picker");
    expect(component).toBeDefined();
  });

  it("hides days, minutes and seconds when respective hide props are provided", () => {
    const { queryByTestId } = render(<TimerPicker hideDays hideMinutes hideSeconds />);
    const dayPicker = queryByTestId("duration-scroll-day");
    const minutePicker = queryByTestId("duration-scroll-minute");
    const secondPicker = queryByTestId("duration-scroll-second");
    expect(dayPicker).toBeNull();
    expect(minutePicker).toBeNull();
    expect(secondPicker).toBeNull();
  });

  it("uses the custom FlatList component when provided", () => {
    const CustomFlatList = (props: any) => <FlatList {...props} testID="custom-flat-list" />;
    const { queryAllByTestId } = render(<TimerPicker FlatList={CustomFlatList} />);
    const customFlatList = queryAllByTestId("custom-flat-list");
    expect(customFlatList).toHaveLength(3);
  });

  it("renders all pickers by default (hours, minutes, seconds)", () => {
    const { getByTestId } = render(<TimerPicker />);
    expect(getByTestId("duration-scroll-hour")).toBeDefined();
    expect(getByTestId("duration-scroll-minute")).toBeDefined();
    expect(getByTestId("duration-scroll-second")).toBeDefined();
  });

  it("hides hours when hideHours is true", () => {
    const { queryByTestId } = render(<TimerPicker hideHours />);
    expect(queryByTestId("duration-scroll-hour")).toBeNull();
  });

  it("renders with custom initial value", () => {
    const { getByTestId } = render(
      <TimerPicker initialValue={{ hours: 2, minutes: 30, seconds: 45 }} />
    );
    expect(getByTestId("timer-picker")).toBeDefined();
  });

  it("renders with hourInterval", () => {
    const { getByTestId } = render(<TimerPicker hourInterval={2} />);
    expect(getByTestId("timer-picker")).toBeDefined();
  });

  it("renders with minuteInterval", () => {
    const { getByTestId } = render(<TimerPicker minuteInterval={15} />);
    expect(getByTestId("timer-picker")).toBeDefined();
  });

  it("renders with secondInterval", () => {
    const { getByTestId } = render(<TimerPicker secondInterval={5} />);
    expect(getByTestId("timer-picker")).toBeDefined();
  });

  it("renders with custom labels", () => {
    const { getByText } = render(
      <TimerPicker hourLabel="hrs" minuteLabel="mins" secondLabel="secs" />
    );
    expect(getByText("hrs")).toBeDefined();
    expect(getByText("mins")).toBeDefined();
    expect(getByText("secs")).toBeDefined();
  });

  it("renders LinearGradient when specified", () => {
    const { getByTestId } = render(<TimerPicker use12HourPicker={false} />);
    expect(getByTestId("timer-picker")).toBeDefined();
  });

  it("handles combination of hide props", () => {
    const { queryByTestId } = render(<TimerPicker hideHours hideSeconds />);
    expect(queryByTestId("duration-scroll-hour")).toBeNull();
    expect(queryByTestId("duration-scroll-minute")).toBeDefined();
    expect(queryByTestId("duration-scroll-second")).toBeNull();
  });

  it("handles onDurationChange callback", () => {
    const onDurationChangeMock = jest.fn();
    const { getByTestId } = render(<TimerPicker onDurationChange={onDurationChangeMock} />);
    expect(getByTestId("timer-picker")).toBeDefined();
  });

  it("renders with all hide props and days enabled", () => {
    const { getByTestId, queryByTestId } = render(
      <TimerPicker hideDays={false} hideHours hideMinutes hideSeconds />
    );
    expect(getByTestId("duration-scroll-day")).toBeDefined();
    expect(queryByTestId("duration-scroll-hour")).toBeNull();
    expect(queryByTestId("duration-scroll-minute")).toBeNull();
    expect(queryByTestId("duration-scroll-second")).toBeNull();
  });

  describe("separateAmPmPicker", () => {
    it("does not render an AM/PM column when separateAmPmPicker is false", () => {
      const { queryByTestId } = render(<TimerPicker use12HourPicker />);
      expect(queryByTestId("duration-scroll-am-pm")).toBeNull();
    });

    it("does not render an AM/PM column when use12HourPicker is false", () => {
      const { queryByTestId } = render(<TimerPicker separateAmPmPicker />);
      expect(queryByTestId("duration-scroll-am-pm")).toBeNull();
    });

    it("renders the AM/PM column when both flags are set", () => {
      const { getByTestId } = render(<TimerPicker separateAmPmPicker use12HourPicker />);
      expect(getByTestId("duration-scroll-am-pm")).toBeDefined();
    });

    it("emits the initial 24-hour value through onDurationChange", () => {
      const onDurationChange = jest.fn();
      render(
        <TimerPicker
          initialValue={{ hours: 17, minutes: 0, seconds: 0 }}
          onDurationChange={onDurationChange}
          separateAmPmPicker
          use12HourPicker
        />
      );
      expect(onDurationChange).toHaveBeenCalledWith({
        days: 0,
        hours: 17,
        minutes: 0,
        seconds: 0,
      });
    });

    it("renders 12-hour cycle hour items (no AM/PM suffix)", () => {
      const { getByText, queryByText } = render(
        <TimerPicker
          initialValue={{ hours: 0 }}
          padHoursWithZero={false}
          separateAmPmPicker
          use12HourPicker
        />
      );
      // "12" appears as the noon/midnight slot
      expect(getByText("12")).toBeDefined();
      // No suffixed strings like "12 AM" or "01 PM"
      expect(queryByText("12 AM")).toBeNull();
      expect(queryByText("01 PM")).toBeNull();
    });

    it("renders AM and PM rows in the AM/PM column", () => {
      const { getAllByText } = render(
        <TimerPicker amLabel="AM" pmLabel="PM" separateAmPmPicker use12HourPicker />
      );
      // Defaults are "am"/"pm"; we override here so the labels match exactly.
      expect(getAllByText("AM").length).toBeGreaterThan(0);
      expect(getAllByText("PM").length).toBeGreaterThan(0);
    });

    it("greys hour rows whose 24h value falls outside hourLimit (given current AM/PM)", () => {
      // hourLimit { 9, 17 } with currentAmPm=AM (initial 9 AM = 9):
      // - hour row "08" represents 8 AM = 8, out of range → greyed
      // - hour row "09" represents 9 AM = 9, in range → not greyed
      // - hour row "11" represents 11 AM = 11, in range → not greyed
      const { getByTestId } = render(
        <TimerPicker
          amLabel="AM"
          hourLimit={{ max: 17, min: 9 }}
          initialValue={{ hours: 9 }}
          padHoursWithZero
          pmLabel="PM"
          separateAmPmPicker
          use12HourPicker
        />
      );
      const hoursColumn = within(getByTestId("duration-scroll-hour"));
      const isGreyed = (el: { props: { style?: unknown } }) => {
        const style = el.props.style;
        const arr = Array.isArray(style) ? style : [style];
        return arr.some((s) => s && (s as { opacity?: number }).opacity === 0.2);
      };

      expect(hoursColumn.getAllByText("08").every(isGreyed)).toBe(true);
      expect(hoursColumn.getAllByText("09").every((el) => !isGreyed(el))).toBe(true);
      expect(hoursColumn.getAllByText("11").every((el) => !isGreyed(el))).toBe(true);
    });

    it("preserves the original use12HourPicker behaviour when separateAmPmPicker is false", () => {
      const onDurationChange = jest.fn();
      render(
        <TimerPicker
          initialValue={{ hours: 17, minutes: 0, seconds: 0 }}
          onDurationChange={onDurationChange}
          use12HourPicker
        />
      );
      expect(onDurationChange).toHaveBeenCalledWith({
        days: 0,
        hours: 17,
        minutes: 0,
        seconds: 0,
      });
    });

    describe("initial-value round-trip", () => {
      it.each([
        [0, "12 AM"],
        [1, "1 AM"],
        [11, "11 AM"],
        [12, "12 PM"],
        [13, "1 PM"],
        [17, "5 PM"],
        [23, "11 PM"],
      ])("emits hours=%i (%s) through onDurationChange", (hours) => {
        const onDurationChange = jest.fn();
        render(
          <TimerPicker
            initialValue={{ hours }}
            onDurationChange={onDurationChange}
            separateAmPmPicker
            use12HourPicker
          />
        );
        expect(onDurationChange).toHaveBeenLastCalledWith(expect.objectContaining({ hours }));
      });
    });

    describe("setValue ref API", () => {
      it.each([[0], [1], [11], [12], [13], [17], [23]])(
        "setValue({ hours: %i }) emits hours=%i",
        (hours) => {
          const onDurationChange = jest.fn();
          const ref = React.createRef<TimerPickerRef>();
          // Pick an initial that differs from every test case to guarantee a state change.
          render(
            <TimerPicker
              ref={ref}
              initialValue={{ hours: 7 }}
              onDurationChange={onDurationChange}
              separateAmPmPicker
              use12HourPicker
            />
          );
          onDurationChange.mockClear();
          act(() => {
            ref.current?.setValue({ hours });
          });
          expect(onDurationChange).toHaveBeenLastCalledWith(expect.objectContaining({ hours }));
        }
      );
    });

    describe("ignored prop warnings", () => {
      let warnSpy: jest.SpyInstance;

      beforeEach(() => {
        warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
      });

      afterEach(() => {
        warnSpy.mockRestore();
      });

      it("warns when maximumHours is set with separateAmPmPicker", () => {
        render(<TimerPicker maximumHours={10} separateAmPmPicker use12HourPicker />);
        expect(warnSpy).toHaveBeenCalledWith(
          expect.stringContaining('"maximumHours" is currently ignored')
        );
      });

      it("does not warn when maximumHours is the default", () => {
        render(<TimerPicker separateAmPmPicker use12HourPicker />);
        expect(warnSpy).not.toHaveBeenCalledWith(
          expect.stringContaining('"maximumHours" is currently ignored')
        );
      });

      it("does not warn about hourLimit anymore (it now works in separate mode)", () => {
        render(<TimerPicker hourLimit={{ max: 17, min: 9 }} separateAmPmPicker use12HourPicker />);
        expect(warnSpy).not.toHaveBeenCalledWith(
          expect.stringContaining('"hourLimit" is currently ignored')
        );
      });

      it("does not warn when separateAmPmPicker is off", () => {
        render(<TimerPicker hourLimit={{ max: 17, min: 9 }} maximumHours={10} use12HourPicker />);
        expect(warnSpy).not.toHaveBeenCalledWith(
          expect.stringContaining('"maximumHours" is currently ignored')
        );
      });
    });
  });
});
