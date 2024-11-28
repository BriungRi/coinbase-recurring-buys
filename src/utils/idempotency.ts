export const getIdempotencyKey = (safetyOrderFrequencySeconds: number) =>
  Math.floor(Date.now() / 1000 / safetyOrderFrequencySeconds).toString();
