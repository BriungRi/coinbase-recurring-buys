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
  safetyIdempotencyDuration,
}: {
  amount: number;
  product: string;
  side: string;
  dry: boolean;
  safetyIdempotencyDuration: number;
}) => {
  const { apiKey, apiSecret } = getEnv();
  const client = new RESTClient(apiKey, apiSecret, dry);
  const idempotencyKey = getIdempotencyKey(product, safetyIdempotencyDuration);
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
  logger.info(
    createOrderRequest,
    `Placing a ${side} market order for $${amount} ${product}`,
  );
  const response = await client.createOrder(createOrderRequest);
  logger.info(response, "Order placed successfully");
};
