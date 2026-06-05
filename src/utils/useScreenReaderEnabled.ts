import { useState, useEffect } from "react";

import { AccessibilityInfo } from "react-native";

export const useScreenReaderEnabled = (): boolean => {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then((screenReaderEnabled) => {
      setIsScreenReaderEnabled(screenReaderEnabled);
    });

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
