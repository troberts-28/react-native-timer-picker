import { useState, useEffect } from "react";

import { AccessibilityInfo } from "react-native";

/**
 * Custom hook to detect if a screen reader (VoiceOver/TalkBack) is currently enabled.
 * Returns a boolean that updates when the screen reader state changes.
 */
export const useScreenReaderEnabled = (): boolean => {
    const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

    useEffect(() => {
        // Check if screen reader is enabled on mount
        AccessibilityInfo.isScreenReaderEnabled().then(
            (screenReaderEnabled) => {
                setIsScreenReaderEnabled(screenReaderEnabled);
            }
        );

        // Subscribe to screen reader state changes
        const subscription = AccessibilityInfo.addEventListener(
            "screenReaderChanged",
            (screenReaderEnabled) => {
                setIsScreenReaderEnabled(screenReaderEnabled);
            }
        );

        return () => {
            subscription?.remove();
        };
    }, []);

    return isScreenReaderEnabled;
};
