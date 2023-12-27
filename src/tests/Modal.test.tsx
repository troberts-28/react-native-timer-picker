import React from "react";
import { Text } from "react-native";
import { render, fireEvent } from "@testing-library/react-native";
import Modal from "../components/Modal";

describe("Modal", () => {
    it("renders without crashing", () => {
        const { getByTestId } = render(<Modal isVisible/>);
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

    // Add more test cases to cover different interactions, scenarios, and edge cases
});
