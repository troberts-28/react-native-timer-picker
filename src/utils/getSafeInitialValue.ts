export const getSafeInitialValue = (
    initialValue:
        | {
              hours?: number;
              minutes?: number;
              seconds?: number;
          }
        | undefined
) => ({
    hours:
        typeof initialValue?.hours === "number" && !isNaN(initialValue?.hours)
            ? initialValue.hours
            : 0,
    minutes:
        typeof initialValue?.minutes === "number" &&
        !isNaN(initialValue?.minutes)
            ? initialValue.minutes
            : 0,
    seconds:
        typeof initialValue?.seconds === "number" &&
        !isNaN(initialValue?.seconds)
            ? initialValue.seconds
            : 0,
});
