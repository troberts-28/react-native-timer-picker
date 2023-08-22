export const getScrollIndex = (variables: {
    value: number;
    numberOfItems: number;
    padWithNItems: number;
    disableInfiniteScroll?: boolean;
}) => {
    const { value, numberOfItems, padWithNItems, disableInfiniteScroll } =
        variables;

    return (
        ((value + numberOfItems) % (numberOfItems * 3)) +
        (disableInfiniteScroll ? padWithNItems : 0) -
        (padWithNItems - 1)
    );
};
