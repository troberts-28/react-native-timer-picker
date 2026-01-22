/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RefObject } from "react";

import type { View } from "react-native";

import type { generateStyles } from "../TimerPicker/styles";

export interface DurationScrollProps {
    Audio?: any;
    FlatList?: any;
    Haptics?: any;
    LinearGradient?: any;
    MaskedView?: any;
    accessibilityHint?: string;
    accessibilityLabel?: string;
    aggressivelyGetLatestDuration: boolean;
    allowFontScaling?: boolean;
    amLabel?: string;
    clickSoundAsset?: SoundAsset;
    decelerationRate?: number | "normal" | "fast";
    disableInfiniteScroll?: boolean;
    formatValue?: (value: number) => string;
    initialValue?: number;
    interval: number;
    is12HourPicker?: boolean;
    isDisabled?: boolean;
    isScreenReaderEnabled?: boolean;
    label?: string | React.ReactElement;
    limit?: Limit;
    maximumValue: number;
    onDurationChange: (duration: number) => void;
    padNumbersWithZero?: boolean;
    padWithNItems: number;
    pickerFeedback?: () => void | Promise<void>;
    pickerGradientOverlayProps?: Partial<LinearGradientProps>;
    pmLabel?: string;
    repeatNumbersNTimes?: number;
    repeatNumbersNTimesNotExplicitlySet: boolean;
    styles: ReturnType<typeof generateStyles>;
    testID?: string;
}

export interface DurationScrollRef {
    latestDuration: RefObject<number>;
    reset: (options?: { animated?: boolean }) => void;
    setValue: (value: number, options?: { animated?: boolean }) => void;
}

type LinearGradientPoint = {
    x: number;
    y: number;
};

export type LinearGradientProps = React.ComponentProps<typeof View> & {
    colors: string[];
    end?: LinearGradientPoint | null;
    locations?: number[] | null;
    start?: LinearGradientPoint | null;
};

export type Limit = {
    max?: number;
    min?: number;
};

export type SoundAsset =
    | number
    | {
          headers?: Record<string, string>;
          overrideFileExtensionAndroid?: string;
          uri: string;
      };

export type ExpoAvAudioInstance = {
    replayAsync: () => Promise<void>;
    unloadAsync: () => Promise<void>;
};
