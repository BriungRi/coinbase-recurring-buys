# Coinbase Recurring Buys

This script allows you to automatically purchase or sell cryptocurrencies on Coinbase using market or limit orders. The script can be scheduled to run at regular intervals using a cronjob.

## Prerequisites

- A Coinbase account with API access enabled
- Node.js and npm installed on your Ubuntu machine
- Your Coinbase API key and secret

## Setup

1. **Clone the Repository**

   Clone this repository to your local machine:

   ```bash
   git clone https://github.com/BriungRi/coinbase-recurring-buys.git
   cd coinbase-recurring-buys
   ```

2. **Install Dependencies**

   Install the required npm packages:

   ```bash
   pnpm install
   ```

3. **Configure API Credentials**

   Copy the `.env.example` file to `.env` and fill in your Coinbase API credentials:

   ```bash
   API_KEY=
   API_SECRET=
   ```

4. **Test the Script**

   Run the script manually to ensure it works:

   For a market order (e.g., buy $1 of BTC-USD):

   ```bash
   pnpm start market --amount 1 --product BTC-USD --side BUY
   ```

   For a limit order (e.g., buy $1 of BTC-USD 1% below the best bid):

   ```bash
   pnpm start limit --amount 1 --product BTC-USD --side BUY --percent 1
   ```

   To test in the sandbox environment, add the `--dry` flag:

   ```bash
   pnpm start market --amount 1 --product BTC-USD --side BUY --dry
   ```

## Setting Up the Cronjob

1. **Open the Crontab Editor**

   Open the crontab editor:

   ```bash
   crontab -e
   ```

2. **Schedule the Script**

   Add the following line to schedule the script to run every day at 2 AM:

   ```bash
   0 2 * * * cd /path/to/your/repo && pnpm start market --amount 1 --product BTC-USD --side BUY
   ```

   Replace `/path/to/your/repo` with the actual path to your repository. You can get this by running `pwd` in your repository directory.

   We recommend using [crontab.guru](https://crontab.guru/) to check and generate cron schedules.

3. **Save and Exit**

   Save the file and exit the editor. The cronjob is now set up to run the script at the specified time.

4. **Check Previous Runs**

   To check the status of previous runs, view the cron logs:

   ```bash
   grep CRON /var/log/syslog
   ```

   You can also check your Coinbase account history to verify successful transactions.

## Notes

- Ensure your account has sufficient funds to cover the purchases
- Consider setting up recurring USDC buys as they typically don't incur fees
- Monitor your Coinbase account regularly to verify successful transactions
