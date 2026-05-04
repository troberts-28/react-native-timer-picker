import React from "react";

import { View, Text } from "react-native";

import { isWithinLimit } from "../../utils/isWithinLimit";
import { combineToHour24 } from "../../utils/separateAmPmHour";
import type { Limit } from "../DurationScroll/types";
import type { generateStyles } from "../TimerPicker/styles";

interface PickerItemProps {
  adjustedLimitedMax: number;
  adjustedLimitedMin: number;
  allowFontScaling: boolean;
  amLabel?: string;
  combinedHourLimit?: Limit;
  currentAmPm?: number;
  is12HourPicker?: boolean;
  isAmPmPicker?: boolean;
  item: string;
  pickerAmPmPositionStyle?: { left: "50%"; marginLeft: number };
  pmLabel?: string;
  selectedValue?: number;
  separateAmPmPicker?: boolean;
  styles: ReturnType<typeof generateStyles>;
}

const isCombinedHourInRange = (hour24: number, limit: Limit | undefined): boolean => {
  if (!limit || (limit.min === undefined && limit.max === undefined)) return true;
  return isWithinLimit(hour24, limit.min ?? 0, limit.max ?? 23);
};

const PickerItem = React.memo<PickerItemProps>(
  ({
    adjustedLimitedMax,
    adjustedLimitedMin,
    allowFontScaling,
    amLabel,
    combinedHourLimit,
    currentAmPm,
    is12HourPicker,
    isAmPmPicker,
    item,
    pickerAmPmPositionStyle,
    pmLabel,
    selectedValue,
    separateAmPmPicker,
    styles,
  }) => {
    let stringItem = item;
    let intItem: number;
    let isAm: boolean | undefined;

    if (isAmPmPicker) {
      // Compare to the amLabel/pmLabel passed in; padding rows are empty strings.
      if (item === amLabel) {
        intItem = 0;
      } else if (item === pmLabel) {
        intItem = 1;
      } else {
        intItem = NaN;
      }
    } else if (is12HourPicker && separateAmPmPicker) {
      // Hour column in clock-face form (12, 1, 2, ..., 11). The "12" slot represents
      // the noon/midnight cycle index 0; every other display value matches its index.
      const parsed = parseInt(item);
      intItem = isNaN(parsed) ? NaN : parsed === 12 ? 0 : parsed;
    } else if (is12HourPicker) {
      isAm = item.includes("AM");
      stringItem = item.replace(/\s[AP]M/g, "");
      intItem = parseInt(stringItem);

      // map 12-hour display value back to 24-hour for limit comparison
      if (!isAm && intItem !== 12) {
        intItem += 12;
      } else if (isAm && intItem === 12) {
        intItem = 0;
      }
    } else {
      intItem = parseInt(item);
    }

    const isSelected = !isNaN(intItem) && intItem === selectedValue;

    let isDisabled: boolean;
    if (isAmPmPicker) {
      // The AM/PM column is always freely toggleable so users can navigate to a
      // different half of the clock; the hour column handles all limit enforcement
      // (greying + snap-back) once AM/PM has been chosen.
      isDisabled = false;
    } else if (is12HourPicker && separateAmPmPicker) {
      // Hour cycle row folds into 24h with the current AM/PM.
      isDisabled =
        !isNaN(intItem) &&
        currentAmPm !== undefined &&
        !isCombinedHourInRange(combineToHour24(intItem, currentAmPm), combinedHourLimit);
    } else {
      isDisabled = !isWithinLimit(intItem, adjustedLimitedMin, adjustedLimitedMax);
    }

    return (
      <View key={item} style={styles.pickerItemContainer} testID="picker-item">
        <Text
          allowFontScaling={allowFontScaling}
          style={[
            styles.pickerItem,
            isSelected && styles.selectedPickerItem,
            isDisabled ? styles.disabledPickerItem : {},
          ]}
        >
          {stringItem}
        </Text>
        {is12HourPicker && !separateAmPmPicker && (
          <View style={[styles.pickerAmPmContainer, pickerAmPmPositionStyle]}>
            <Text allowFontScaling={allowFontScaling} style={styles.pickerAmPmLabel}>
              {isAm ? amLabel : pmLabel}
            </Text>
          </View>
        )}
      </View>
    );
  }
);

export default PickerItem;
