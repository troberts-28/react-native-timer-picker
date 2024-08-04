export const getScrollIndex = (variables: {
    numberOfItems: number;
    padWithNItems: number;
    repeatNumbersNTimes: number;
    value: number;
}) => {
    const { numberOfItems, padWithNItems, repeatNumbersNTimes, value } =
        variables;

    return Math.max(
        ((value + numberOfItems) % (numberOfItems * repeatNumbersNTimes)) -
            (padWithNItems - 1),
        0
    );
};
