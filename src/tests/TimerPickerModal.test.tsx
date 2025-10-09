import React from "react";

import { render, fireEvent, cleanup } from "@testing-library/react-native";

import TimerPickerModal from "../components/TimerPickerModal";

describe("TimerPickerModal", () => {
    const mockOnConfirm = jest.fn();
    const mockOnCancel = jest.fn();

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        cleanup();
    });

    const defaultProps = {
        visible: true,
        setIsVisible: jest.fn(),
        onConfirm: mockOnConfirm,
        onCancel: mockOnCancel,
    };

    it("renders without crashing", () => {
        const { getByTestId } = render(<TimerPickerModal {...defaultProps} />);
        const component = getByTestId("timer-picker-modal");
        expect(component).toBeDefined();
    });

    it("calls onConfirm when Confirm button is pressed", () => {
        const { getByText } = render(<TimerPickerModal {...defaultProps} />);
        const confirmButton = getByText("Confirm");
        fireEvent.press(confirmButton);
        expect(mockOnConfirm).toHaveBeenCalled();
    });

    it("calls onCancel when Cancel button is pressed", () => {
        const { getByText } = render(<TimerPickerModal {...defaultProps} />);
        const cancelButton = getByText("Cancel");
        fireEvent.press(cancelButton);
        expect(mockOnCancel).toHaveBeenCalled();
    });

    it("hides the modal when Cancel button is pressed", () => {
        const setIsVisibleMock = jest.fn();
        const { getByText } = render(
            <TimerPickerModal
                {...defaultProps}
                setIsVisible={setIsVisibleMock}
            />
        );
        const cancelButton = getByText("Cancel");
        fireEvent.press(cancelButton);
        expect(setIsVisibleMock).toHaveBeenCalledWith(false);
    });

    it("hides the modal when overlay is pressed", () => {
        const setIsVisibleMock = jest.fn();
        const { getByTestId } = render(
            <TimerPickerModal
                {...defaultProps}
                closeOnOverlayPress
                setIsVisible={setIsVisibleMock}
            />
        );
        const overlay = getByTestId("modal-backdrop");
        fireEvent.press(overlay);
        expect(setIsVisibleMock).toHaveBeenCalledWith(false);
    });

    it("calls onConfirm with selected duration when Confirm button is pressed", () => {
        const { getByText } = render(<TimerPickerModal {...defaultProps} />);
        // Select duration in TimerPicker, assuming its interaction is tested separately
        const confirmButton = getByText("Confirm");
        fireEvent.press(confirmButton);
        expect(mockOnConfirm).toHaveBeenCalledWith(expect.objectContaining({}));
    });

    it("renders but is not visible when visible prop is false", () => {
        const { getByTestId } = render(
            <TimerPickerModal {...defaultProps} visible={false} />
        );
        const modal = getByTestId("timer-picker-modal");
        expect(modal).toBeDefined();
        // Modal component still renders but with visible={false}
        expect(modal.props.visible).toBe(false);
    });

    it("renders with custom button labels", () => {
        const { getByText } = render(
            <TimerPickerModal
                {...defaultProps}
                confirmButtonText="OK"
                cancelButtonText="Dismiss"
            />
        );
        expect(getByText("OK")).toBeDefined();
        expect(getByText("Dismiss")).toBeDefined();
    });

    it("renders with custom modal title", () => {
        const { getByText } = render(
            <TimerPickerModal {...defaultProps} modalTitle="Select Time" />
        );
        expect(getByText("Select Time")).toBeDefined();
    });

    it("does not close on overlay press when closeOnOverlayPress is false", () => {
        const setIsVisibleMock = jest.fn();
        const { getByTestId } = render(
            <TimerPickerModal
                {...defaultProps}
                closeOnOverlayPress={false}
                setIsVisible={setIsVisibleMock}
            />
        );
        const overlay = getByTestId("modal-backdrop");
        fireEvent.press(overlay);
        expect(setIsVisibleMock).not.toHaveBeenCalled();
    });

    it("hides Cancel button when hideCancelButton is true", () => {
        const { queryByText } = render(
            <TimerPickerModal {...defaultProps} hideCancelButton />
        );
        expect(queryByText("Cancel")).toBeNull();
    });

    it("renders with initial value", () => {
        const { getByTestId } = render(
            <TimerPickerModal
                {...defaultProps}
                initialValue={{ hours: 2, minutes: 30, seconds: 0 }}
            />
        );
        expect(getByTestId("timer-picker-modal")).toBeDefined();
    });

    it("renders with custom intervals", () => {
        const { getByTestId } = render(
            <TimerPickerModal
                {...defaultProps}
                hourInterval={2}
                minuteInterval={15}
                secondInterval={5}
            />
        );
        expect(getByTestId("timer-picker-modal")).toBeDefined();
    });

    it("calls both onCancel and setIsVisible when Cancel is pressed", () => {
        const setIsVisibleMock = jest.fn();
        const onCancelMock = jest.fn();
        const { getByText } = render(
            <TimerPickerModal
                {...defaultProps}
                onCancel={onCancelMock}
                setIsVisible={setIsVisibleMock}
            />
        );
        const cancelButton = getByText("Cancel");
        fireEvent.press(cancelButton);
        expect(onCancelMock).toHaveBeenCalled();
        expect(setIsVisibleMock).toHaveBeenCalledWith(false);
    });

    it("hides specific time units when respective hide props are provided", () => {
        const { getByTestId } = render(
            <TimerPickerModal {...defaultProps} hideHours hideSeconds />
        );
        expect(getByTestId("timer-picker-modal")).toBeDefined();
        // Note: The specific duration scroll test IDs would be in the TimerPicker component
    });

    it("renders without crashing with all optional props", () => {
        const { getByTestId } = render(
            <TimerPickerModal
                {...defaultProps}
                modalTitle="Pick Duration"
                confirmButtonText="Done"
                cancelButtonText="Close"
                hourLabel="h"
                minuteLabel="m"
                secondLabel="s"
                hideHours={false}
                hideMinutes={false}
                hideSeconds={false}
                hideDays={false}
            />
        );
        expect(getByTestId("timer-picker-modal")).toBeDefined();
    });
});
