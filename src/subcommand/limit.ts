import { getEnv } from "../env";
import { logger } from "../logger";
import { RESTClient } from "../sdk/rest";
import { OrderSide } from "../sdk/rest/types/common-types";
import { CreateOrderRequest } from "../sdk/rest/types/orders-types";
import { getIdempotencyKey } from "../utils/idempotency";
import { roundToNearestIncrement } from "../utils/math";

export const handleLimitCommand = async ({
  amount,
  product,
  side,
  percent,
  dry,
  safetyIdempotencyDuration,
}: {
  amount: number;
  product: string;
  side: string;
  percent: string;
  dry: boolean;
  safetyIdempotencyDuration: number;
}) => {
  const { apiKey, apiSecret } = getEnv();
  const client = new RESTClient(apiKey, apiSecret, dry);
  const idempotencyKey = getIdempotencyKey(product, safetyIdempotencyDuration);

  // Fetch the best bid and ask prices
  const { base_increment, quote_increment } = await client.getProduct({
    productId: product,
  });
  const { pricebooks } = await client.getBestBidAsk({
    productIds: [product],
  });
  const pricebook = pricebooks[0];
  const bestBid = pricebook.bids[0];
  const bestAsk = pricebook.asks[0];
  const bestBidPrice = parseFloat(bestBid.price);
  const bestAskPrice = parseFloat(bestAsk.price);
  const bestBidSize = parseFloat(bestBid.size);
  const bestAskSize = parseFloat(bestAsk.size);
  const limitPrice = roundToNearestIncrement(
    side === "BUY"
      ? (bestBidPrice * (100 - parseFloat(percent))) / 100
      : (bestAskPrice * (100 + parseFloat(percent))) / 100,
    parseFloat(quote_increment),
  );
  const baseSize = roundToNearestIncrement(
    amount / limitPrice,
    parseFloat(base_increment),
  );
  logger.info(
    {
      bestBidPrice,
      bestBidSize,
      bestAskPrice,
      bestAskSize,
      limitPrice,
      baseSize,
      base_increment,
      quote_increment,
    },
    "Derived limitPrice and baseSize",
  );

  const createOrderRequest: CreateOrderRequest = {
    clientOrderId: idempotencyKey,
    productId: product,
    side: side as OrderSide,
    orderConfiguration: {
      limit_limit_gtc: {
        baseSize: baseSize.toString(),
        limitPrice: limitPrice.toString(),
        postOnly: false,
      },
    },
  };
  logger.info(
    createOrderRequest,
    `Placing a ${side} limit order for ${amount} ${product}.`,
  );
  const response = await client.createOrder(createOrderRequest);
  logger.info(response, "Order placed successfully");
};
