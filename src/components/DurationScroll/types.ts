/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { type RefObject } from "react";

import type { View } from "react-native";

import type { generateStyles } from "../TimerPicker/styles";

export interface DurationScrollProps {
  aggressivelyGetLatestDuration: boolean;
  allowFontScaling?: boolean;
  amLabel?: string;
  Audio?: any;
  clickSoundAsset?: SoundAsset;
  decelerationRate?: number | "normal" | "fast";
  disableInfiniteScroll?: boolean;
  FlatList?: any;
  /**
   * Optional override for the column's snap-to-valid logic. When provided,
   * `onMomentumScrollEnd` runs the raw value through this function instead of
   * the default `limit`-based clamp. Used by `TimerPicker` to inject cross-column
   * context (e.g. AM/PM) into hour-column snapping.
   */
  getValidValue?: (rawValue: number) => number;
  Haptics?: any;
  initialValue?: number;
  interval: number;
  is12HourPicker?: boolean;
  isAmPmPicker?: boolean;
  isDisabled?: boolean;
  /**
   * Optional override for per-row "is this disabled?" decision. When provided,
   * `PickerItem` calls this with the parsed row value instead of comparing against
   * the column-local `limit`. Used by `TimerPicker` for combined-hour greying.
   */
  isItemDisabled?: (value: number) => boolean;
  label?: string | React.ReactElement;
  limit?: Limit;
  LinearGradient?: any;
  MaskedView?: any;
  maximumValue: number;
  onDurationChange: (duration: number) => void;
  padNumbersWithZero?: boolean;
  padWithNItems: number;
  pickerColumnWidth?: number;
  pickerFeedback?: () => void | Promise<void>;
  pickerGradientOverlayProps?: Partial<LinearGradientProps>;
  pickerLabelGap?: number;
  pmLabel?: string;
  repeatNumbersNTimes?: number;
  repeatNumbersNTimesNotExplicitlySet: boolean;
  selectedValue?: number;
  separateAmPmPicker?: boolean;
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
