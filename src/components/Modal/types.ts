import type { ComponentProps } from "react";

import type { ViewStyle } from "react-native";
import type { Modal as ReactNativeModal } from "react-native";

export interface ModalProps {
    animationDuration?: number;
    children?: React.ReactElement;
    contentStyle?: ViewStyle;
    isVisible?: boolean;
    modalProps?: ComponentProps<typeof ReactNativeModal>;
    onHide?: () => void;
    onOverlayPress?: () => void;
    overlayOpacity?: number;
    overlayStyle?: ViewStyle;
    testID?: string;
}
