export const getScrollIndex = (variables: {
    numberOfItems: number;
    padWithNItems: number;
    repeatNumbersNTimes: number;
    value: number;
}) => {
    const {
        numberOfItems,
        padWithNItems,
        repeatNumbersNTimes,
        value,
    } = variables;

    return (
        ((value + numberOfItems) % (numberOfItems * repeatNumbersNTimes)) +
        (padWithNItems - 1)
    );
};
