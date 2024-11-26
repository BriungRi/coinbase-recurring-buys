import * as dotenv from "dotenv";
import { parseArgs } from "./args";
import { getEnv } from "./env";
import { RESTClient } from "./sdk/rest";
import { OrderSide } from "./sdk/rest/types/common-types";
import { CreateOrderRequest } from "./sdk/rest/types/orders-types";
import { roundToNearestIncrement } from "./math";
dotenv.config();

const main = async () => {
  const { subCommand, amount, productId, side, dry, percent } = parseArgs();
  const { apiKey, apiSecret, safetyOrderFrequencySeconds } = getEnv();
  const client = new RESTClient(apiKey, apiSecret, dry);

  try {
    const idempotencyKey = Math.floor(
      Date.now() / 1000 / safetyOrderFrequencySeconds
    ).toString();

    if (subCommand === "market") {
      console.log(
        `Constructing a market ${side} order for $${amount} ${productId}`
      );
      const createOrderRequest: CreateOrderRequest = {
        clientOrderId: idempotencyKey,
        productId: productId,
        side: side as OrderSide,
        orderConfiguration: {
          market_market_ioc: {
            quote_size: amount,
          },
        },
      };
      const response = await client.createOrder(createOrderRequest);
      console.log("Order placed successfully:", response);
    } else if (subCommand === "limit") {
      if (!percent) {
        throw new Error("Percent must be specified for limit orders");
      }

      // Fetch the best bid and ask prices
      const { base_increment, quote_increment } = await client.getProduct({
        productId,
      });
      const { pricebooks } = await client.getBestBidAsk({
        productIds: [productId],
      });
      const pricebook = pricebooks[0];
      const bestBid = pricebook.bids[0];
      const bestAsk = pricebook.asks[0];
      const limitPrice = roundToNearestIncrement(
        side === "BUY"
          ? (bestBid.price * (100 - parseFloat(percent))) / 100
          : (bestAsk.price * (100 + parseFloat(percent))) / 100,
        parseFloat(quote_increment)
      );
      const baseSize = roundToNearestIncrement(
        amount / limitPrice,
        parseFloat(base_increment)
      );
      if (side === "BUY") {
        console.log({ bestBid, limitPrice, baseSize });
      } else {
        console.log({ bestAsk, limitPrice, baseSize });
      }
      console.log(`Placing a ${side} limit order for $${amount} ${productId}.`);
      const createOrderRequest: CreateOrderRequest = {
        clientOrderId: idempotencyKey,
        productId: productId,
        side: side as OrderSide,
        orderConfiguration: {
          limit_limit_gtc: {
            baseSize: baseSize.toString(),
            limitPrice: limitPrice.toString(),
            postOnly: false,
          },
        },
      };
      const response = await client.createOrder(createOrderRequest);
      console.log("Order placed successfully:", response);
    } else {
      throw new Error("Invalid subcommand");
    }
  } catch (error) {
    console.error(
      "Error placing order:",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
};

main().catch(console.error);
