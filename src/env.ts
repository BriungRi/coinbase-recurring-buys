export const getEnv = () => {
  const apiKey = process.env.API_KEY;
  const apiSecret = process.env.API_SECRET;
  const safetyOrderFrequencySeconds =
    process.env.SAFETY_ORDER_FREQUENCY_SECONDS;

  if (!apiKey) {
    throw new Error("Error: API_KEY must be set in .env file");
  }

  if (!apiSecret) {
    throw new Error("Error: API_SECRET must be set in .env file");
  }

  if (!safetyOrderFrequencySeconds) {
    throw new Error(
      "Error: SAFETY_ORDER_FREQUENCY_SECONDS must be set in .env file",
    );
  } else if (isNaN(parseInt(safetyOrderFrequencySeconds))) {
    throw new Error(
      "Error: SAFETY_ORDER_FREQUENCY_SECONDS must be a number in .env file",
    );
  }

  return {
    apiKey,
    apiSecret,
    safetyOrderFrequencySeconds: parseInt(safetyOrderFrequencySeconds),
  };
};
