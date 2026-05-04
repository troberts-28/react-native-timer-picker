import React from "react";

import { View, Text } from "react-native";

import { isWithinLimit } from "../../utils/isWithinLimit";
import type { generateStyles } from "../TimerPicker/styles";

interface PickerItemProps {
  adjustedLimitedMax: number;
  adjustedLimitedMin: number;
  allowFontScaling: boolean;
  amLabel?: string;
  is12HourPicker?: boolean;
  item: string;
  pickerAmPmPositionStyle?: { left: "50%"; marginLeft: number };
  pmLabel?: string;
  selectedValue?: number;
  styles: ReturnType<typeof generateStyles>;
}

const PickerItem = React.memo<PickerItemProps>(
  ({
    adjustedLimitedMax,
    adjustedLimitedMin,
    allowFontScaling,
    amLabel,
    is12HourPicker,
    item,
    pickerAmPmPositionStyle,
    pmLabel,
    selectedValue,
    styles,
  }) => {
    let stringItem = item;
    let intItem: number;
    let isAm: boolean | undefined;

    if (!is12HourPicker) {
      intItem = parseInt(item);
    } else {
      isAm = item.includes("AM");
      stringItem = item.replace(/\s[AP]M/g, "");
      intItem = parseInt(stringItem);

      // map 12-hour display value back to 24-hour for limit comparison
      if (!isAm && intItem !== 12) {
        intItem += 12;
      } else if (isAm && intItem === 12) {
        intItem = 0;
      }
    }

    const isSelected = intItem === selectedValue;
    const isDisabled = !isWithinLimit(intItem, adjustedLimitedMin, adjustedLimitedMax);

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
        {is12HourPicker && (
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
