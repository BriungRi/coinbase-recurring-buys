import { Command } from "commander";

export const parseArgs = () => {
  const program = new Command();

  program.option("--dry", "Use the sandbox environment");

  const marketCommand = program
    .command("market")
    .description("Place a market order")
    .requiredOption("--amount <USD_AMOUNT>", "Amount in USD to buy/sell")
    .requiredOption(
      "--product <PRODUCT_ID>",
      "Product ID to trade (e.g., BTC-USD)"
    )
    .requiredOption("--side <SIDE>", "Order side (BUY or SELL)");

  const limitCommand = program
    .command("limit")
    .description("Place a limit order")
    .requiredOption("--amount <USD_AMOUNT>", "Amount in USD to buy/sell")
    .requiredOption(
      "--product <PRODUCT_ID>",
      "Product ID to trade (e.g., BTC-USD)"
    )
    .requiredOption("--side <SIDE>", "Order side (BUY or SELL)", (value) => {
      if (value !== "BUY" && value !== "SELL") {
        throw new Error("Side must be BUY or SELL");
      }
      return value;
    })
    .requiredOption(
      "--percent <PERCENT>",
      "Percentage difference from the best bid or ask price"
    );

  program.parse(process.argv);

  const options = program.opts();
  const subCommand = program.args[0];
  const subCommandOptions =
    subCommand === "market" ? marketCommand.opts() : limitCommand.opts();

  const amount = subCommandOptions.amount;
  const productId = subCommandOptions.product;
  const side = subCommandOptions.side;
  const dry = options.dry || false;
  const percent =
    subCommand === "limit" ? subCommandOptions.percent : undefined;

  return { subCommand, amount, productId, side, dry, percent };
};
