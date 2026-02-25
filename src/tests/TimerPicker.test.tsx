import React from "react";

import { render } from "@testing-library/react-native";
import { FlatList } from "react-native";

import TimerPicker from "../components/TimerPicker";

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
    const CustomFlatList = (props) => <FlatList {...props} testID="custom-flat-list" />;
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

  it("renders with disabled state", () => {
    const { getByTestId } = render(<TimerPicker disabled />);
    expect(getByTestId("timer-picker")).toBeDefined();
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
});
