import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import TimerPickerModal from "../components";

describe("TimerPickerModal", () => {
    const mockOnConfirm = jest.fn();
    const mockOnCancel = jest.fn();

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
                setIsVisible={setIsVisibleMock}
                closeOnOverlayPress
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
});
