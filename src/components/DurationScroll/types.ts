/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MutableRefObject } from "react";

import type {
    View,
    FlatList,
    FlatListProps as RNFlatListProps,
} from "react-native";

import type { generateStyles } from "../TimerPicker/styles";

export type FlatListType = <ItemT = any>(
    props: React.PropsWithChildren<
        RNFlatListProps<ItemT> & React.RefAttributes<FlatList<ItemT>>
    >,
    ref: React.ForwardedRef<FlatList<ItemT>>
) => React.ReactElement | null;

export interface DurationScrollProps {
    Audio?: any;
    Haptics?: any;
    LinearGradient?: any;
    aggressivelyGetLatestDuration: boolean;
    allowFontScaling?: boolean;
    amLabel?: string;
    bottomPickerGradientOverlayProps?: Partial<LinearGradientProps>;
    clickSoundAsset?: SoundAssetType;
    disableInfiniteScroll?: boolean;
    initialValue?: number;
    is12HourPicker?: boolean;
    isDisabled?: boolean;
    label?: string | React.ReactElement;
    limit?: LimitType;
    numberOfItems: number;
    onDurationChange: (duration: number) => void;
    padNumbersWithZero?: boolean;
    padWithNItems: number;
    pickerGradientOverlayProps?: Partial<LinearGradientProps>;
    pmLabel?: string;
    styles: ReturnType<typeof generateStyles>;
    testID?: string;
    topPickerGradientOverlayProps?: Partial<LinearGradientProps>;
    FlatListComponent?: FlatListType;
}

export interface DurationScrollRef {
    latestDuration: MutableRefObject<number>;
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

export type LimitType = {
    max?: number;
    min?: number;
};

export type SoundAssetType =
    | number
    | {
          headers?: Record<string, string>;
          overrideFileExtensionAndroid?: string;
          uri: string;
      };
