# Coinbase Recurring Buys

This script allows you to automatically purchase cryptocurrencies on Coinbase using a market order specified in USD. The script can be scheduled to run at regular intervals using a cronjob.

## Prerequisites

- An account on Coinbase with API access enabled.
- `curl` installed on your Ubuntu machine.
- Your Coinbase API key, secret, and passphrase.

## Setup

1. **Clone the Repository**

   Clone this repository to your local machine.
   ```bash
   git clone https://github.com/BriungRi/coinbase-recurring-buys.git
   cd coinbase-recurring-buys
   ```

2. **Configure API Credentials**

   Copy the `.env.example` file to `.env` and fill in your Coinbase API credentials:
   ```bash
   API_KEY=
   API_SECRET=
   API_PASSPHRASE=
   ```

3. **Make the Script Executable**

   Make the script executable by running:
   ```bash
   chmod +x dca.sh
   ```

4. **Test the Script**

   Run the script manually to ensure it works:
   ```bash
   ./dca.sh --amount 50 --product BTC-USD
   ```

   To test in the sandbox environment, use the `--dry` flag:
   ```bash
   ./dca.sh --amount 50 --product BTC-USD --dry
   ```

## Setting Up the Cronjob

1. **Open the Crontab Editor**

   Open the crontab editor by running:
   ```bash
   crontab -e
   ```

2. **Schedule the Script**

   Add the following line to schedule the script to run every day at 2 AM:
   ```bash
   0 2 * * * /path/to/your/dca.sh --amount 50 --product BTC-USD
   ```

   Replace `/path/to/your/dca.sh` with the actual path to your script.

3. **Save and Exit**

   Save the file and exit the editor. The cronjob is now set up to run the script at the specified time.

## Notes

- Ensure your account has sufficient funds to cover the purchase.
- Monitor your Coinbase account for successful transactions.