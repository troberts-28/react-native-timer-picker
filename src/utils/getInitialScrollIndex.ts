export const getInitialScrollIndex = (variables: {
    numberOfItems: number;
    padWithNItems: number;
    repeatNumbersNTimes: number;
    value: number;
}) => {
    const { numberOfItems, padWithNItems, repeatNumbersNTimes, value } =
        variables;

    return Math.max(
        numberOfItems * Math.floor(repeatNumbersNTimes / 2) +
            ((value + numberOfItems) % numberOfItems) -
            padWithNItems,
        0
    );
};
