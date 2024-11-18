import type { LimitType } from "../components/DurationScroll/types";

export const getAdjustedLimit = (
    limit: LimitType | undefined,
    numberOfItems: number,
    interval: number
): {
    max: number;
    min: number;
} => {
    const maxValue = (numberOfItems - 1) * interval;

    if (!limit || (!limit.max && !limit.min)) {
        return {
            max: maxValue,
            min: 0,
        };
    }

    // guard against limits that are out of bounds
    const adjustedMaxLimit = limit.max
        ? Math.min(limit.max, maxValue)
        : maxValue;
    const adjustedMinLimit = limit.min ? Math.max(limit.min, 0) : 0;

    // guard against invalid limits
    if (adjustedMaxLimit < adjustedMinLimit) {
        return {
            max: maxValue,
            min: 0,
        };
    }

    return {
        max: adjustedMaxLimit,
        min: adjustedMinLimit,
    };
};
