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
}: {
  amount: number;
  product: string;
  side: string;
  percent: number;
  dry: boolean;
}) => {
  const { apiKey, apiSecret, safetyOrderFrequencySeconds } = getEnv();
  const client = new RESTClient(apiKey, apiSecret, dry);
  const idempotencyKey = getIdempotencyKey(safetyOrderFrequencySeconds);

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
  const limitPrice = roundToNearestIncrement(
    side === "BUY"
      ? (bestBid.price * (100 - percent)) / 100
      : (bestAsk.price * (100 + percent)) / 100,
    parseFloat(quote_increment),
  );
  const baseSize = roundToNearestIncrement(
    amount / limitPrice,
    parseFloat(base_increment),
  );
  if (side === "BUY") {
    logger.info({ bestBid, limitPrice, baseSize });
  } else {
    logger.info({ bestAsk, limitPrice, baseSize });
  }
  logger.info(`Placing a ${side} limit order for $${amount} ${product}.`);
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
  const response = await client.createOrder(createOrderRequest);
  logger.info(response, "Order placed successfully");
};
