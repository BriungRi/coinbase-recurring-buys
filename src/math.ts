export const roundToNearestIncrement = (
  value: number,
  increment: number
): number => {
  return Math.round(value / increment) * increment;
};
