#!/bin/bash

# Usage: dca.sh --amount <USD_AMOUNT> --product <PRODUCT_ID> [--dry]

# Default to production API URL
API_URL="https://api.coinbase.com/api/v3/brokerage/orders"

# Parse the arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --amount) AMOUNT="$2"; shift ;;
        --product) PRODUCT_ID="$2"; shift ;;
        --dry) API_URL="https://api-public.sandbox.pro.coinbase.com/api/v3/brokerage/orders" ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

# Check if amount and product ID are provided
if [ -z "$AMOUNT" ] || [ -z "$PRODUCT_ID" ]; then
    echo "Error: Amount or Product ID not specified. Use --amount <USD_AMOUNT> --product <PRODUCT_ID> [--dry]"
    exit 1
fi

# Coinbase Advanced Trade API credentials
# Load environment variables from .env file
if [ -f .env ]; then
    source .env
else
    echo "Error: .env file not found"
    exit 1
fi

# Verify required environment variables are set
if [ -z "$API_KEY" ]; then
    echo "Error: API_KEY must be set in .env file"
    exit 1
fi

if [ -z "$API_SECRET" ]; then
    echo "Error: API_SECRET must be set in .env file"
    exit 1
fi

if [ -z "$API_PASSPHRASE" ]; then
    echo "Error: API_PASSPHRASE must be set in .env file"
    exit 1
fi

# Get current hour in epoch time for idempotency
# NOTE: This means that at max only 1 order can be placed per hour
IDEMPOTENCY_KEY=$(date +%s -d "$(date +%Y-%m-%d\ %H):00:00")

# Create a market order
TIMESTAMP=$(date +%s)
SIGNATURE=$(echo -n "$TIMESTAMPPOST/api/v3/brokerage/orders{\"client_order_id\":\"$IDEMPOTENCY_KEY\",\"product_id\":\"$PRODUCT_ID\",\"side\":\"BUY\",\"order_configuration\":{\"market_market_ioc\":{\"quote_size\":\"$AMOUNT\"}}}" | openssl dgst -sha256 -hmac "$API_SECRET" -binary | base64)

# Execute the order
curl -X POST $API_URL \
    -H "CB-ACCESS-KEY: $API_KEY" \
    -H "CB-ACCESS-SIGN: $SIGNATURE" \
    -H "CB-ACCESS-TIMESTAMP: $TIMESTAMP" \
    -H "CB-ACCESS-PASSPHRASE: $API_PASSPHRASE" \
    -H "Content-Type: application/json" \
    -d '{
        "client_order_id": "'"$IDEMPOTENCY_KEY"'",
        "product_id": "'"$PRODUCT_ID"'",
        "side": "BUY",
        "order_configuration": {
            "market_market_ioc": {
                "quote_size": "'"$AMOUNT"'"
            }
        }
    }'