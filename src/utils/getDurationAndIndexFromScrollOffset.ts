export const getDurationAndIndexFromScrollOffset = (variables: {
    disableInfiniteScroll: boolean;
    itemHeight: number;
    numberOfItems: number;
    padWithNItems: number;
    yContentOffset: number;
    interval?: number
}) => {
    const {
        disableInfiniteScroll,
        itemHeight,
        numberOfItems,
        padWithNItems,
        yContentOffset,
        interval
    } = variables;

    const index = Math.round(yContentOffset / itemHeight);

    let duration =
        (disableInfiniteScroll ? index : index + padWithNItems) % numberOfItems
    if (interval) {
        duration = interval * duration
    }
    
    return {
        duration,
        index,
    };
};
