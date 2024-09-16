export const getInitialScrollIndex = (variables: {
    disableInfiniteScroll: boolean;
    numberOfItems: number;
    padWithNItems: number;
    repeatNumbersNTimes: number;
    value: number;
    interval?: number;
}) => {
    const {
        disableInfiniteScroll,
        numberOfItems,
        padWithNItems,
        repeatNumbersNTimes,
        value,
        interval
    } = variables;

    const initialScrollIndex =
        Math.max(
            numberOfItems * Math.floor(repeatNumbersNTimes / 2) +
            (((interval ? value / interval : value) + numberOfItems) % numberOfItems) -
            (!disableInfiniteScroll ? padWithNItems : 0),
            0
        )
    return initialScrollIndex;
};
