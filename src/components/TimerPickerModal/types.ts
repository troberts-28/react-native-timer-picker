import type { MutableRefObject } from "react";

import type { View, TouchableOpacity, Text } from "react-native";

import type Modal from "../Modal";
import type { TimerPickerProps } from "../TimerPicker/types";

import type { CustomTimerPickerModalStyles } from "./styles";

export interface TimerPickerModalRef {
    latestDuration: {
        hours: MutableRefObject<number> | undefined;
        minutes: MutableRefObject<number> | undefined;
        seconds: MutableRefObject<number> | undefined;
    };
    reset: (options?: { animated?: boolean }) => void;
    setValue: (
        value: {
            hours: number;
            minutes: number;
            seconds: number;
        },
        options?: { animated?: boolean }
    ) => void;
}

export interface TimerPickerModalProps extends TimerPickerProps {
    buttonContainerProps?: React.ComponentProps<typeof View>;
    buttonTouchableOpacityProps?: React.ComponentProps<typeof TouchableOpacity>;
    cancelButtonText?: string;
    closeOnOverlayPress?: boolean;
    confirmButtonText?: string;
    containerProps?: React.ComponentProps<typeof View>;
    contentContainerProps?: React.ComponentProps<typeof View>;
    hideCancelButton?: boolean;
    modalProps?: React.ComponentProps<typeof Modal>;
    modalTitle?: string;
    modalTitleProps?: React.ComponentProps<typeof Text>;
    onCancel?: () => void;
    onConfirm: ({
        hours,
        minutes,
        seconds,
    }: {
        hours: number;
        minutes: number;
        seconds: number;
    }) => void;
    setIsVisible: (isVisible: boolean) => void;
    styles?: CustomTimerPickerModalStyles;
    visible: boolean;
}
