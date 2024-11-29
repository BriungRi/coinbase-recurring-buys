export const getIdempotencyKey = (
  productId: string,
  safetyOrderFrequencySeconds: number,
) =>
  `${productId}-${Math.floor(
    Date.now() / 1000 / safetyOrderFrequencySeconds,
  ).toString()}`;
