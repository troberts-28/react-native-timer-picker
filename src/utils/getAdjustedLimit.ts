import type { LimitType } from "../components/TimerPicker/DurationScroll";

export const getAdjustedLimit = (
    limit: LimitType | undefined,
    numberOfItems: number
): {
    max: number;
    min: number;
} => {
    if (!limit || (!limit.max && !limit.min)) {
        return {
            max: numberOfItems,
            min: 0,
        };
    }

    const adjustedMaxLimit = limit.max
        ? Math.min(limit.max, numberOfItems)
        : numberOfItems;
    const adjustedMinLimit = limit.min ? Math.max(limit.min, 0) : 0;

    return {
        max: adjustedMaxLimit,
        min: adjustedMinLimit,
    };
};
