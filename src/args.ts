export const parseArgs = () => {
  // Parse command line arguments
  const args = process.argv.slice(2);
  let amount: string | undefined;
  let productId: string | undefined;
  let dry = false;
  args.forEach((arg, index) => {
    if (arg === "--amount") {
      amount = args[index + 1];
    } else if (arg === "--product") {
      productId = args[index + 1];
    } else if (arg === "--dry") {
      dry = true;
    }
  });
  // Check if amount and product ID are provided
  if (!amount || !productId) {
    console.error(
      "Error: Amount or Product ID not specified. Use --amount <USD_AMOUNT> --product <PRODUCT_ID> [--dry]"
    );
    process.exit(1);
  }

  return { amount, productId, dry };
};
