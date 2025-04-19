export const getSafeInitialValue = (
    initialValue:
        | {
              days?: number;
              hours?: number;
              minutes?: number;
              seconds?: number;
          }
        | undefined
) => ({
    days:
        typeof initialValue?.days === "number" && !isNaN(initialValue?.days)
            ? initialValue.days
            : 0,
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
