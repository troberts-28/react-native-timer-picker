import type { RefObject } from "react";

import type { View } from "react-native";

import type {
    LinearGradientProps,
    SoundAsset,
    Limit,
} from "../DurationScroll/types";

import type { CustomTimerPickerStyles } from "./styles";

export interface TimerPickerRef {
    latestDuration: {
        days: RefObject<number> | undefined;
        hours: RefObject<number> | undefined;
        minutes: RefObject<number> | undefined;
        seconds: RefObject<number> | undefined;
    };
    reset: (options?: { animated?: boolean }) => void;
    setValue: (
        value: {
            days: number;
            hours: number;
            minutes: number;
            seconds: number;
        },
        options?: { animated?: boolean }
    ) => void;
}

export interface TimerPickerProps {
    /** @deprecated Use pickerFeedback prop instead. Will be removed in a future version. */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Audio?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FlatList?: any;
    /** @deprecated Use pickerFeedback prop instead. Will be removed in a future version. */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Haptics?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    LinearGradient?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    MaskedView?: any;
    aggressivelyGetLatestDuration?: boolean;
    allowFontScaling?: boolean;
    amLabel?: string;
    /** @deprecated Use pickerFeedback prop instead. Will be removed in a future version. */
    clickSoundAsset?: SoundAsset;
    dayInterval?: number;
    dayLabel?: string | React.ReactElement;
    dayLimit?: Limit;
    daysPickerIsDisabled?: boolean;
    decelerationRate?: number | "normal" | "fast";
    disableInfiniteScroll?: boolean;
    hideDays?: boolean;
    hideHours?: boolean;
    hideMinutes?: boolean;
    hideSeconds?: boolean;
    hourInterval?: number;
    hourLabel?: string | React.ReactElement;
    hourLimit?: Limit;
    hoursPickerIsDisabled?: boolean;
    initialValue?: {
        days?: number;
        hours?: number;
        minutes?: number;
        seconds?: number;
    };
    maximumDays?: number;
    maximumHours?: number;
    maximumMinutes?: number;
    maximumSeconds?: number;
    minuteInterval?: number;
    minuteLabel?: string | React.ReactElement;
    minuteLimit?: Limit;
    minutesPickerIsDisabled?: boolean;
    onDurationChange?: (duration: {
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    }) => void;
    padDaysWithZero?: boolean;
    padHoursWithZero?: boolean;
    padMinutesWithZero?: boolean;
    padSecondsWithZero?: boolean;
    padWithNItems?: number;
    pickerContainerProps?: React.ComponentProps<typeof View>;
    pickerFeedback?: () => void | Promise<void>;
    pickerGradientOverlayProps?: Partial<LinearGradientProps>;
    pmLabel?: string;
    repeatDayNumbersNTimes?: number;
    repeatHourNumbersNTimes?: number;
    repeatMinuteNumbersNTimes?: number;
    repeatSecondNumbersNTimes?: number;
    secondInterval?: number;
    secondLabel?: string | React.ReactElement;
    secondLimit?: Limit;
    secondsPickerIsDisabled?: boolean;
    styles?: CustomTimerPickerStyles;
    use12HourPicker?: boolean;
}
