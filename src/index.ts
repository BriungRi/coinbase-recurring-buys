import * as dotenv from "dotenv";
import { parseArgs } from "./args";
import { getEnv } from "./env";
import { RESTClient } from "./sdk/rest";
import { OrderSide } from "./sdk/rest/types/common-types";
import { CreateOrderRequest } from "./sdk/rest/types/orders-types";
dotenv.config();

const main = async () => {
  const { amount, productId, dry } = parseArgs();
  const { apiKey, apiSecret, safetyOrderFrequencySeconds } = getEnv();
  const client = new RESTClient(apiKey, apiSecret, dry);

  // Create a market order
  try {
    const idempotencyKey = Math.floor(
      Date.now() / 1000 / safetyOrderFrequencySeconds
    ).toString();
    const createOrderRequest: CreateOrderRequest = {
      clientOrderId: idempotencyKey,
      productId: productId,
      side: OrderSide.BUY,
      orderConfiguration: {
        market_market_ioc: {
          quote_size: amount,
        },
      },
    };
    const response = await client.createOrder(createOrderRequest);
    console.log("Order placed successfully:", response);
  } catch (error) {
    console.error(
      "Error placing order:",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
};

main().catch(console.error);
