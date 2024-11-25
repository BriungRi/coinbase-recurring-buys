export const getEnv = () => {
  const apiKey = process.env.API_KEY;
  const apiSecret = process.env.API_SECRET;

  if (!apiKey) {
    console.error("Error: API_KEY must be set in .env file");
    process.exit(1);
  }

  if (!apiSecret) {
    console.error("Error: API_SECRET must be set in .env file");
    process.exit(1);
  }

  return { apiKey, apiSecret };
};
