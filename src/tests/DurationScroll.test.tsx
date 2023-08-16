import React from "react";
import { render } from "@testing-library/react-native";
import DurationScroll from "../components/TimerPicker/DurationScroll";

describe("DurationScroll", () => {
    const onDurationChangeMock = jest.fn();
    const emptyStyles = {
        pickerContainer: {},
        pickerLabelContainer: {},
        pickerLabel: {},
        pickerItemContainer: {},
        pickerItem: {},
        pickerGradientOverlay: {},
    };

    it("renders without crashing", () => {
        const { getByTestId } = render(
            <DurationScroll
                numberOfItems={1}
                onDurationChange={onDurationChangeMock}
                padWithNItems={0}
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
                numberOfItems={2}
                onDurationChange={onDurationChangeMock}
                padWithNItems={1}
                styles={emptyStyles}
            />
        );
        const items = getAllByTestId("picker-item");
        expect(items).toHaveLength(7);
    });

    it("renders the label if provided", () => {
        const { getByText } = render(
            <DurationScroll
                numberOfItems={59}
                label="Duration"
                onDurationChange={onDurationChangeMock}
                padWithNItems={1}
                styles={emptyStyles}
            />
        );
        const label = getByText("Duration");
        expect(label).toBeDefined();
    });

});
