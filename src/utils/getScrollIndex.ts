export const getScrollIndex = (variables: {
    disableInfiniteScroll?: boolean;
    numberOfItems: number;
    padWithNItems: number;
    value: number;
}) => {
    const { disableInfiniteScroll, numberOfItems, padWithNItems, value } =
        variables;

    return (
        ((value + numberOfItems) % (numberOfItems * 3)) +
        (disableInfiniteScroll ? padWithNItems : 0) -
        (padWithNItems - 1)
    );
};
