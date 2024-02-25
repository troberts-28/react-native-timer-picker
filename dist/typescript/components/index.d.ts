import React, { MutableRefObject } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TimerPickerProps } from "./TimerPicker";
import Modal from "./Modal";
import { CustomTimerPickerModalStyles } from "./TimerPickerModal.styles";
export interface TimerPickerModalRef {
    reset: (options?: { animated?: boolean }) => void;
    setValue: (
        value: {
            hours: number;
            minutes: number;
            seconds: number;
        },
        options?: {
            animated?: boolean;
        }
    ) => void;
    latestDuration: {
        hours: MutableRefObject<number> | undefined;
        minutes: MutableRefObject<number> | undefined;
        seconds: MutableRefObject<number> | undefined;
    };
}
export interface TimerPickerModalProps extends TimerPickerProps {
    visible: boolean;
    setIsVisible: (isVisible: boolean) => void;
    onConfirm: ({
        hours,
        minutes,
        seconds,
    }: {
        hours: number;
        minutes: number;
        seconds: number;
    }) => void;
    onCancel?: () => void;
    closeOnOverlayPress?: boolean;
    hideCancelButton?: boolean;
    confirmButtonText?: string;
    cancelButtonText?: string;
    modalTitle?: string;
    modalProps?: React.ComponentProps<typeof Modal>;
    containerProps?: React.ComponentProps<typeof View>;
    contentContainerProps?: React.ComponentProps<typeof View>;
    buttonContainerProps?: React.ComponentProps<typeof View>;
    buttonTouchableOpacityProps?: React.ComponentProps<typeof TouchableOpacity>;
    modalTitleProps?: React.ComponentProps<typeof Text>;
    styles?: CustomTimerPickerModalStyles;
    isPricePicker?: boolean;
    centDataLimit?: number | undefined;
    dollorDataLimit?: number | undefined;
    centDataIterationValue?: number | undefined;
    dollorDataIterationValue?: number | undefined;
}
declare const _default: React.MemoExoticComponent<
    React.ForwardRefExoticComponent<
        TimerPickerModalProps & React.RefAttributes<TimerPickerModalRef>
    >
>;
export default _default;
