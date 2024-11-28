import * as dotenv from "dotenv";
dotenv.config();

import { Command } from "commander";
import { handleMarketCommand } from "./subcommand/market";
import { handleLimitCommand } from "./subcommand/limit";

const program = new Command();

program.option("--dry", "Use the sandbox environment");

program
  .command("market")
  .description("Place a market order")
  .requiredOption("--amount <USD_AMOUNT>", "Amount in USD to buy/sell")
  .requiredOption(
    "--product <PRODUCT_ID>",
    "Product ID to trade (e.g., BTC-USD)",
  )
  .requiredOption("--side <SIDE>", "Order side (BUY or SELL)")
  .action(handleMarketCommand);

program
  .command("limit")
  .description("Place a limit order")
  .requiredOption("--amount <USD_AMOUNT>", "Amount in USD to buy/sell")
  .requiredOption(
    "--product <PRODUCT_ID>",
    "Product ID to trade (e.g., BTC-USD)",
  )
  .requiredOption("--side <SIDE>", "Order side (BUY or SELL)", (value) => {
    if (value !== "BUY" && value !== "SELL") {
      throw new Error("Side must be BUY or SELL");
    }
    return value;
  })
  .requiredOption(
    "--percent <PERCENT>",
    "Percentage difference from the best bid or ask price",
  )
  .action(handleLimitCommand);

const main = async () => {
  await program.parseAsync(process.argv);
};

main();
