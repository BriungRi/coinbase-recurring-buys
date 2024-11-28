export const getEnv = () => {
  const apiKey = process.env.API_KEY;
  const apiSecret = process.env.API_SECRET;
  const safetyOrderFrequencySeconds =
    process.env.SAFETY_ORDER_FREQUENCY_SECONDS;

  if (!apiKey) {
    console.error("Error: API_KEY must be set in .env file");
    process.exit(1);
  }

  if (!apiSecret) {
    console.error("Error: API_SECRET must be set in .env file");
    process.exit(1);
  }

  if (!safetyOrderFrequencySeconds) {
    console.error(
      "Error: SAFETY_ORDER_FREQUENCY_SECONDS must be set in .env file",
    );
    process.exit(1);
  } else if (isNaN(parseInt(safetyOrderFrequencySeconds))) {
    console.error(
      "Error: SAFETY_ORDER_FREQUENCY_SECONDS must be a number in .env file",
    );
    process.exit(1);
  }

  return {
    apiKey,
    apiSecret,
    safetyOrderFrequencySeconds: parseInt(safetyOrderFrequencySeconds),
  };
};
