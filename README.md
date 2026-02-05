# Nory MCP Server

**Give any AI agent the ability to pay.**

The Nory MCP Server enables AI agents and assistants to make instant micropayments using the x402 protocol. Built for the future where AI agents are consumers.

## What is this?

This is a [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that gives AI assistants like Claude the ability to:

- Check wallet balances
- Make direct payments
- Access paid APIs with automatic x402 payment handling
- Discover x402-enabled services
- View payment history

## Installation

```bash
npm install @nory/mcp-server
```

Or clone and build locally:

```bash
git clone https://github.com/nory/mcp-server
cd mcp-server
npm install
npm run build
```

## Configuration

### For Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "nory": {
      "command": "npx",
      "args": ["@nory/mcp-server"],
      "env": {
        "NORY_WALLET_KEY": "your-wallet-private-key",
        "NORY_API_URL": "https://api.noryx402.com"
      }
    }
  }
}
```

### For Claude Code

Add to your project's `.mcp.json`:

```json
{
  "servers": {
    "nory": {
      "command": "npx",
      "args": ["@nory/mcp-server"],
      "env": {
        "NORY_WALLET_KEY": "${NORY_WALLET_KEY}"
      }
    }
  }
}
```

## Available Tools

### `nory_check_balance`

Check your current wallet balance.

```
"Check my Nory wallet balance"
```

### `nory_pay`

Make a direct payment to a wallet address.

```
"Pay 5 USDC to GkXn9...abc with memo 'Thanks!'"
```

### `nory_x402_request`

Make an HTTP request to an x402-enabled API. Automatically handles payment negotiation.

```
"Use Nory to fetch data from https://api.noryx402.com/data/crypto"
```

### `nory_discover_services`

Find x402-enabled services you can pay for.

```
"What x402 services are available for AI tasks?"
```

### `nory_payment_history`

View your recent payment history.

```
"Show me my last 10 Nory transactions"
```

## How x402 Works

1. **Request** - Agent makes HTTP request to x402-enabled endpoint
2. **402 Response** - Server returns HTTP 402 with payment details
3. **Payment** - Agent creates signed transaction via Nory
4. **Settlement** - Transaction confirmed on Solana in < 1 second
5. **Access** - Agent retries request with payment proof, gets response

All of this happens automatically when you use `nory_x402_request`.

## Example Usage

### Access a paid API

```
User: "Use Nory to get the latest crypto prices from the premium data feed"

Claude: I'll use the Nory x402 payment system to access this paid API.
[Calls nory_x402_request with url="https://api.noryx402.com/data/crypto"]

Result: Successfully paid 0.0001 USDC and received the data...
```

### Check balance before a task

```
User: "Before we start, check how much I have in my Nory wallet"

Claude: [Calls nory_check_balance]

Your Nory wallet (GkXn...abc) has:
- 100.00 USDC
- 1.50 SOL
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NORY_WALLET_KEY` | Your Solana wallet private key | Yes |
| `NORY_API_URL` | Nory API endpoint (default: https://api.noryx402.com) | No |

## Security

- **Non-custodial**: Your keys never leave your machine
- **Spending limits**: Configure max transaction amounts
- **Audit log**: All transactions are logged locally

## Why Nory?

- **Sub-second settlements** on Solana
- **Sub-cent payments** enabled
- **HTTP-native** - works with any API
- **Multi-chain** - Solana, Base, Polygon, Arbitrum, and more
- **Built for AI** - designed for autonomous agents

## Links

- [Nory Website](https://noryx402.com)
- [x402 Protocol Spec](https://noryx402.com/docs/x402)
- [API Documentation](https://noryx402.com/docs/api)

## License

MIT
