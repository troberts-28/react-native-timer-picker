export const getInitialScrollIndex = (variables: {
    disableInfiniteScroll: boolean;
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

    return Math.max(
        numberOfItems * Math.floor(repeatNumbersNTimes / 2) +
            ((value + numberOfItems) % numberOfItems) -
            (!disableInfiniteScroll ? padWithNItems : 0),
        0
    );
};
