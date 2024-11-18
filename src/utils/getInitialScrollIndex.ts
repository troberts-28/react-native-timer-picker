export const getInitialScrollIndex = (variables: {
    disableInfiniteScroll: boolean;
    interval: number;
    numberOfItems: number;
    padWithNItems: number;
    repeatNumbersNTimes: number;
    value: number;
}) => {
    const {
        disableInfiniteScroll,
        interval,
        numberOfItems,
        padWithNItems,
        repeatNumbersNTimes,
        value,
    } = variables;

    return Math.max(
        numberOfItems * Math.floor(repeatNumbersNTimes / 2) +
            ((value / interval + numberOfItems) % numberOfItems) -
            (!disableInfiniteScroll ? padWithNItems : 0),
        0
    );
};
