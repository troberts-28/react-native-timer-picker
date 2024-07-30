export const getScrollIndex = (variables: {
    disableInfiniteScroll?: boolean;
    numberOfItems: number;
    padWithNItems: number;
    repeatNumbersNTimes: number;
    value: number;
}) => {
    const {
        disableInfiniteScroll,
        numberOfItems,
        padWithNItems,
        repeatNumbersNTimes,
        value,
    } = variables;

    return (
        ((value + numberOfItems) % (numberOfItems * repeatNumbersNTimes)) +
        (disableInfiniteScroll ? padWithNItems : 0) -
        (padWithNItems - 1)
    );
};
