export const getDurationAndIndexFromScrollOffset = (variables: {
    disableInfiniteScroll: boolean;
    itemHeight: number;
    numberOfItems: number;
    padWithNItems: number;
    yContentOffset: number;
}) => {
    const {
        disableInfiniteScroll,
        itemHeight,
        numberOfItems,
        padWithNItems,
        yContentOffset,
    } = variables;

    const index = Math.round(yContentOffset / itemHeight);

    const duration =
        (disableInfiniteScroll ? index : index + padWithNItems) % numberOfItems;

    return {
        duration,
        index,
    };
};
