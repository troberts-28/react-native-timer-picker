/**
 * Formats time components into a string representation of time in HH:MM:SS format.
 * Each component is optional and will only be included if provided.
 * All components are padded with leading zeros to ensure consistent formatting.
 *
 * @param {Object} params - The time components to format
 * @param {number} [params.hours] - Hours component (0-23)
 * @param {number} [params.minutes] - Minutes component (0-59)
 * @param {number} [params.seconds] - Seconds component (0-59)
 * @returns {string} Formatted time string in HH:MM:SS format, with only provided components included
 *
 * @example
 * formatTime({ hours: 1, minutes: 30, seconds: 45 }) // returns "01:30:45"
 * formatTime({ minutes: 5, seconds: 9 }) // returns "05:09"
 * formatTime({ hours: 23 }) // returns "23"
 */
export const formatTime = ({
  hours,
  minutes,
  seconds,
}: {
  hours?: number;
  minutes?: number;
  seconds?: number;
}): string => {
  const timeParts = [];

  if (hours !== undefined) {
    timeParts.push(hours.toString().padStart(2, "0"));
  }
  if (minutes !== undefined) {
    timeParts.push(minutes.toString().padStart(2, "0"));
  }
  if (seconds !== undefined) {
    timeParts.push(seconds.toString().padStart(2, "0"));
  }

  return timeParts.join(":");
};
