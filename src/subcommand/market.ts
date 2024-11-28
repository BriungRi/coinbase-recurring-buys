import { getEnv } from "../env";
import { logger } from "../logger";
import { RESTClient } from "../sdk/rest";
import { OrderSide } from "../sdk/rest/types/common-types";
import { CreateOrderRequest } from "../sdk/rest/types/orders-types";
import { getIdempotencyKey } from "../utils/idempotency";

export const handleMarketCommand = async ({
  amount,
  product,
  side,
  dry,
}: {
  amount: number;
  product: string;
  side: string;
  dry: boolean;
}) => {
  const { apiKey, apiSecret, safetyOrderFrequencySeconds } = getEnv();
  const client = new RESTClient(apiKey, apiSecret, dry);
  logger.info(`Constructing a market ${side} order for $${amount} ${product}`);
  const idempotencyKey = getIdempotencyKey(safetyOrderFrequencySeconds);
  const createOrderRequest: CreateOrderRequest = {
    clientOrderId: idempotencyKey,
    productId: product,
    side: side as OrderSide,
    orderConfiguration: {
      market_market_ioc: {
        quote_size: amount.toString(),
      },
    },
  };
  const response = await client.createOrder(createOrderRequest);
  logger.info(response, "Order placed successfully");
};
