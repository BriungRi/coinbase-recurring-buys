# Coinbase Recurring Buys

This script allows you to automatically purchase cryptocurrencies on Coinbase using a market order specified in USD. The script can be scheduled to run at regular intervals using a cronjob.

## Prerequisites

- An account on Coinbase with API access enabled.
- Node.js and npm installed on your Ubuntu machine.
- Your Coinbase API key, secret, and passphrase.

## Setup

1. **Clone the Repository**

   Clone this repository to your local machine.
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

   As an example to buy $1 worth of BTC:

   Run the script manually to ensure it works:
   ```bash
   pnpm start --amount 1 --product BTC-USD
   ```

   To test in the sandbox environment, use the `--dry` flag:
   ```bash
   pnpm start --amount 1 --product BTC-USD --dry
   ```

## Setting Up the Cronjob

1. **Open the Crontab Editor**

   Open the crontab editor by running:
   ```bash
   crontab -e
   ```

2. **Schedule the Script**

   Again, as an example to buy $1 worth of BTC every day at 2AM, add the following line to your crontab:

   ```bash
   0 2 * * * cd /path/to/your/repo && pnpm start --amount 1 --product BTC-USD
   ```

   Replace `/path/to/your/repo` with the actual path to your repository. HINT: Use `pwd`

   Highly recommend using [crontab.guru](https://crontab.guru/) to check and generate a cron schedule.

3. **Save and Exit**

   Save the file and exit the editor. The cronjob is now set up to run the script at the specified time.

4. **Check Previous Runs**

   To check the status of previous runs, view the cron logs:
   ```bash
   grep CRON /var/log/syslog
   ```

   You can also check your Coinbase account history to verify successful transactions.

## Notes

- Ensure your account has sufficient funds to cover the purchase.
  - HINT: Consider setting up recurring USDC buys because these should not incur fees
- Monitor your Coinbase account for successful transactions.