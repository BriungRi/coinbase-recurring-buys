export const getEnv = () => {
  const apiKey = process.env.API_KEY;
  const apiSecret = process.env.API_SECRET;

  if (!apiKey) {
    throw new Error("Error: API_KEY must be set in .env file");
  }

  if (!apiSecret) {
    throw new Error("Error: API_SECRET must be set in .env file");
  }

  return {
    apiKey,
    apiSecret,
  };
};
