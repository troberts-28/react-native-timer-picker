import React from "react";

import { render, fireEvent, cleanup } from "@testing-library/react-native";
import { Text } from "react-native";

import Modal from "../components/Modal";

describe("Modal", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        cleanup();
    });

    it("renders without crashing", () => {
        const { getByTestId } = render(<Modal isVisible />);
        const component = getByTestId("modal");
        expect(component).toBeDefined();
    });

    it("renders children when visible", () => {
        const { getByText } = render(
            <Modal isVisible>
                <Text>{"Modal Content"}</Text>
            </Modal>
        );
        const content = getByText("Modal Content");
        expect(content).toBeDefined();
    });

    it("calls onOverlayPress when overlay is pressed", () => {
        const onOverlayPressMock = jest.fn();
        const { getByTestId } = render(
            <Modal isVisible onOverlayPress={onOverlayPressMock} />
        );
        const overlay = getByTestId("modal-backdrop");
        fireEvent.press(overlay);
        expect(onOverlayPressMock).toHaveBeenCalled();
    });

    it("renders but is not visible when isVisible is false", () => {
        const { getByTestId } = render(<Modal isVisible={false} />);
        const modal = getByTestId("modal");
        expect(modal).toBeDefined();
        expect(modal.props.visible).toBe(false);
    });

    it("does not call onOverlayPress when onOverlayPress is not provided", () => {
        const { getByTestId } = render(<Modal isVisible />);
        const overlay = getByTestId("modal-backdrop");
        expect(() => fireEvent.press(overlay)).not.toThrow();
    });

    it("handles rapid visibility changes", () => {
        const { getByTestId, rerender } = render(<Modal isVisible={true} />);
        expect(getByTestId("modal")).toBeDefined();
        expect(getByTestId("modal").props.visible).toBe(true);

        rerender(<Modal isVisible={false} />);
        expect(getByTestId("modal")).toBeDefined();
        expect(getByTestId("modal").props.visible).toBe(false);

        rerender(<Modal isVisible={true} />);
        expect(getByTestId("modal")).toBeDefined();
        expect(getByTestId("modal").props.visible).toBe(true);
    });

    it("calls onOverlayPress exactly once per press", () => {
        const onOverlayPressMock = jest.fn();
        const { getByTestId } = render(
            <Modal isVisible onOverlayPress={onOverlayPressMock} />
        );
        const overlay = getByTestId("modal-backdrop");
        fireEvent.press(overlay);
        expect(onOverlayPressMock).toHaveBeenCalledTimes(1);
    });
});
