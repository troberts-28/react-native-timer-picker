import type React from "react";

import type { View } from "react-native";

import type { LinearGradientProps, SoundAsset, Limit } from "../DurationScroll/types";
import type { CustomTimerPickerStyles } from "./styles";

export type LatestDurationRef = { readonly current: number };

export interface TimerPickerRef {
  latestDuration: {
    days: LatestDurationRef | undefined;
    hours: LatestDurationRef | undefined;
    minutes: LatestDurationRef | undefined;
    seconds: LatestDurationRef | undefined;
  };
  reset: (options?: { animated?: boolean }) => void;
  setValue: (
    value: {
      days?: number;
      hours?: number;
      minutes?: number;
      seconds?: number;
    },
    options?: { animated?: boolean }
  ) => void;
}

export interface TimerPickerProps {
  aggressivelyGetLatestDuration?: boolean;
  allowFontScaling?: boolean;
  amLabel?: string;
  /** @deprecated Use pickerFeedback prop instead. Will be removed in a future version. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Audio?: any;
  /** @deprecated Use pickerFeedback prop instead. Will be removed in a future version. */
  clickSoundAsset?: SoundAsset;
  dayInterval?: number;
  dayLabel?: string | React.ReactElement;
  dayLimit?: Limit;
  daysPickerIsDisabled?: boolean;
  decelerationRate?: number | "normal" | "fast";
  disableInfiniteScroll?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  FlatList?: any;
  /** @deprecated Use pickerFeedback prop instead. Will be removed in a future version. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Haptics?: any;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  LinearGradient?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  MaskedView?: any;
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
  /**
   * Render AM/PM as a separate scrollable column instead of appending it to each hour.
   * Only takes effect when `use12HourPicker` is true. Defaults to `false`.
   */
  separateAmPmPicker?: boolean;
  styles?: CustomTimerPickerStyles;
  use12HourPicker?: boolean;
}
