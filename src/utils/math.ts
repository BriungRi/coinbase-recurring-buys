import BigNumber from "bignumber.js";

export const roundToNearestIncrement = (
  value: number,
  increment: number
): number => {
  if (increment === 0) {
    throw new Error("Increment cannot be zero");
  }
  return new BigNumber(value)
    .dividedBy(increment)
    .decimalPlaces(0)
    .multipliedBy(increment)
    .toNumber();
};
