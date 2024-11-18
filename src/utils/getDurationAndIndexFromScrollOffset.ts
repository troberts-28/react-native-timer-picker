export const getDurationAndIndexFromScrollOffset = (variables: {
    disableInfiniteScroll: boolean;
    interval: number;
    itemHeight: number;
    numberOfItems: number;
    padWithNItems: number;
    yContentOffset: number;
}) => {
    const {
        disableInfiniteScroll,
        interval,
        itemHeight,
        numberOfItems,
        padWithNItems,
        yContentOffset,
    } = variables;

    const index = Math.round(yContentOffset / itemHeight);

    const duration =
        ((disableInfiniteScroll ? index : index + padWithNItems) %
            numberOfItems) *
        interval;

    return {
        duration,
        index,
    };
};
