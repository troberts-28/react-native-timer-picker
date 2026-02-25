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
  Haptics?: any;
  initialValue?: number;
  interval: number;
  is12HourPicker?: boolean;
  isDisabled?: boolean;
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
