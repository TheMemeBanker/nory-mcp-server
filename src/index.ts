#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// Nory API configuration
const NORY_API_URL = process.env.NORY_API_URL || "https://api.noryx402.com";
const NORY_WALLET_KEY = process.env.NORY_WALLET_KEY || "";

// Tool input schemas
const PaymentSchema = z.object({
  recipient: z.string().describe("The recipient's wallet address or x402 endpoint URL"),
  amount: z.number().positive().describe("Amount to pay in USDC"),
  memo: z.string().optional().describe("Optional memo/description for the payment"),
});

const CheckBalanceSchema = z.object({
  currency: z.string().default("USDC").describe("Currency to check balance for (default: USDC)"),
});

const X402PaySchema = z.object({
  url: z.string().url().describe("The x402-enabled API endpoint URL"),
  method: z.enum(["GET", "POST", "PUT", "DELETE"]).default("GET").describe("HTTP method"),
  body: z.string().optional().describe("Request body for POST/PUT requests"),
  headers: z.record(z.string()).optional().describe("Additional headers to include"),
});

const DiscoverServicesSchema = z.object({
  category: z.string().optional().describe("Filter services by category (e.g., 'data', 'compute', 'ai')"),
  maxPrice: z.number().optional().describe("Maximum price per request in USDC"),
});

const PaymentHistorySchema = z.object({
  limit: z.number().default(10).describe("Number of transactions to return"),
  offset: z.number().default(0).describe("Offset for pagination"),
});

// Create MCP server
const server = new Server(
  {
    name: "nory-x402-payments",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Simulated wallet state (in production, this would connect to actual Solana wallet)
let walletState = {
  address: "",
  balances: {
    USDC: 100.0,
    SOL: 1.5,
  },
  transactions: [] as Array<{
    id: string;
    type: "payment" | "received";
    amount: number;
    currency: string;
    recipient?: string;
    sender?: string;
    memo?: string;
    timestamp: Date;
    status: "pending" | "confirmed" | "failed";
  }>,
};

// Initialize wallet from environment
if (NORY_WALLET_KEY) {
  walletState.address = NORY_WALLET_KEY.slice(0, 8) + "..." + NORY_WALLET_KEY.slice(-4);
}

// x402 Service Registry (simulated - would be fetched from Nory API)
const x402Services = [
  {
    name: "OpenAI Proxy",
    url: "https://api.noryx402.com/openai",
    description: "Access OpenAI APIs with x402 micropayments",
    pricePerRequest: 0.001,
    category: "ai",
  },
  {
    name: "Web Scraper",
    url: "https://api.noryx402.com/scrape",
    description: "Scrape any webpage with automatic rate limiting",
    pricePerRequest: 0.0005,
    category: "data",
  },
  {
    name: "Image Generation",
    url: "https://api.noryx402.com/images",
    description: "Generate images with DALL-E via x402",
    pricePerRequest: 0.02,
    category: "ai",
  },
  {
    name: "Premium Data Feed",
    url: "https://api.noryx402.com/data/crypto",
    description: "Real-time crypto market data",
    pricePerRequest: 0.0001,
    category: "data",
  },
  {
    name: "Compute Job",
    url: "https://api.noryx402.com/compute",
    description: "Run serverless compute jobs",
    pricePerRequest: 0.01,
    category: "compute",
  },
];

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "nory_check_balance",
        description:
          "Check your current wallet balance. Returns available funds for making x402 payments.",
        inputSchema: {
          type: "object",
          properties: {
            currency: {
              type: "string",
              description: "Currency to check balance for (default: USDC)",
              default: "USDC",
            },
          },
        },
      },
      {
        name: "nory_pay",
        description:
          "Make a direct payment to a wallet address. Use this for sending funds to a specific recipient.",
        inputSchema: {
          type: "object",
          properties: {
            recipient: {
              type: "string",
              description: "The recipient's wallet address",
            },
            amount: {
              type: "number",
              description: "Amount to pay in USDC",
            },
            memo: {
              type: "string",
              description: "Optional memo/description for the payment",
            },
          },
          required: ["recipient", "amount"],
        },
      },
      {
        name: "nory_x402_request",
        description:
          "Make an HTTP request to an x402-enabled API endpoint. Automatically handles payment negotiation and settlement. Use this to access paid APIs and services.",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "The x402-enabled API endpoint URL",
            },
            method: {
              type: "string",
              enum: ["GET", "POST", "PUT", "DELETE"],
              description: "HTTP method (default: GET)",
              default: "GET",
            },
            body: {
              type: "string",
              description: "Request body for POST/PUT requests",
            },
            headers: {
              type: "object",
              description: "Additional headers to include",
            },
          },
          required: ["url"],
        },
      },
      {
        name: "nory_discover_services",
        description:
          "Discover available x402-enabled services and APIs. Find services you can pay for with micropayments.",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "Filter services by category (e.g., 'data', 'compute', 'ai')",
            },
            maxPrice: {
              type: "number",
              description: "Maximum price per request in USDC",
            },
          },
        },
      },
      {
        name: "nory_payment_history",
        description:
          "Get your recent payment history. View past transactions and their status.",
        inputSchema: {
          type: "object",
          properties: {
            limit: {
              type: "number",
              description: "Number of transactions to return (default: 10)",
              default: 10,
            },
            offset: {
              type: "number",
              description: "Offset for pagination (default: 0)",
              default: 0,
            },
          },
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "nory_check_balance": {
      const parsed = CheckBalanceSchema.safeParse(args);
      if (!parsed.success) {
        return {
          content: [
            {
              type: "text",
              text: `Invalid arguments: ${parsed.error.message}`,
            },
          ],
          isError: true,
        };
      }

      const { currency } = parsed.data;
      const balance = walletState.balances[currency as keyof typeof walletState.balances] || 0;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                wallet: walletState.address || "Not configured - set NORY_WALLET_KEY",
                balances: walletState.balances,
                requestedCurrency: currency,
                available: balance,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case "nory_pay": {
      const parsed = PaymentSchema.safeParse(args);
      if (!parsed.success) {
        return {
          content: [
            {
              type: "text",
              text: `Invalid arguments: ${parsed.error.message}`,
            },
          ],
          isError: true,
        };
      }

      const { recipient, amount, memo } = parsed.data;

      // Check balance
      if (walletState.balances.USDC < amount) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: false,
                  error: "Insufficient balance",
                  required: amount,
                  available: walletState.balances.USDC,
                },
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }

      // Simulate payment
      walletState.balances.USDC -= amount;
      const txId = `tx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      const transaction = {
        id: txId,
        type: "payment" as const,
        amount,
        currency: "USDC",
        recipient,
        memo,
        timestamp: new Date(),
        status: "confirmed" as const,
      };

      walletState.transactions.unshift(transaction);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                transactionId: txId,
                amount,
                currency: "USDC",
                recipient,
                memo,
                newBalance: walletState.balances.USDC,
                status: "confirmed",
                settlementTime: "< 1 second",
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case "nory_x402_request": {
      const parsed = X402PaySchema.safeParse(args);
      if (!parsed.success) {
        return {
          content: [
            {
              type: "text",
              text: `Invalid arguments: ${parsed.error.message}`,
            },
          ],
          isError: true,
        };
      }

      const { url, method, body, headers } = parsed.data;

      // Simulate x402 flow:
      // 1. Make initial request
      // 2. Get 402 response with payment details
      // 3. Make payment
      // 4. Retry request with payment proof

      // Find matching service or use default price
      const service = x402Services.find((s) => url.startsWith(s.url));
      const price = service?.pricePerRequest || 0.001;

      // Check balance
      if (walletState.balances.USDC < price) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: false,
                  error: "Insufficient balance for x402 payment",
                  required: price,
                  available: walletState.balances.USDC,
                  url,
                },
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }

      // Simulate successful x402 flow
      walletState.balances.USDC -= price;
      const txId = `x402_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      walletState.transactions.unshift({
        id: txId,
        type: "payment",
        amount: price,
        currency: "USDC",
        recipient: url,
        memo: `x402 request: ${method} ${url}`,
        timestamp: new Date(),
        status: "confirmed",
      });

      // Simulate API response
      const simulatedResponse = {
        success: true,
        x402: {
          transactionId: txId,
          amountPaid: price,
          currency: "USDC",
          settlementTime: "0.4s",
        },
        request: {
          url,
          method,
          body: body ? "(included)" : undefined,
        },
        response: {
          status: 200,
          data:
            service?.category === "ai"
              ? { message: "AI response would appear here", model: "gpt-4" }
              : service?.category === "data"
              ? { data: [{ sample: "data" }], count: 100 }
              : { result: "Success" },
        },
        newBalance: walletState.balances.USDC,
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(simulatedResponse, null, 2),
          },
        ],
      };
    }

    case "nory_discover_services": {
      const parsed = DiscoverServicesSchema.safeParse(args);
      if (!parsed.success) {
        return {
          content: [
            {
              type: "text",
              text: `Invalid arguments: ${parsed.error.message}`,
            },
          ],
          isError: true,
        };
      }

      const { category, maxPrice } = parsed.data;

      let services = [...x402Services];

      if (category) {
        services = services.filter((s) => s.category === category);
      }

      if (maxPrice !== undefined) {
        services = services.filter((s) => s.pricePerRequest <= maxPrice);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                services,
                count: services.length,
                filters: { category, maxPrice },
                hint: "Use nory_x402_request to call any of these services",
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case "nory_payment_history": {
      const parsed = PaymentHistorySchema.safeParse(args);
      if (!parsed.success) {
        return {
          content: [
            {
              type: "text",
              text: `Invalid arguments: ${parsed.error.message}`,
            },
          ],
          isError: true,
        };
      }

      const { limit, offset } = parsed.data;
      const transactions = walletState.transactions.slice(offset, offset + limit);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                transactions,
                total: walletState.transactions.length,
                limit,
                offset,
                hasMore: offset + limit < walletState.transactions.length,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    default:
      return {
        content: [
          {
            type: "text",
            text: `Unknown tool: ${name}`,
          },
        ],
        isError: true,
      };
  }
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "nory://wallet/status",
        name: "Wallet Status",
        description: "Current wallet status and balances",
        mimeType: "application/json",
      },
      {
        uri: "nory://services/registry",
        name: "x402 Service Registry",
        description: "List of all available x402-enabled services",
        mimeType: "application/json",
      },
    ],
  };
});

// Read resources
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case "nory://wallet/status":
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(
              {
                address: walletState.address || "Not configured",
                balances: walletState.balances,
                recentTransactions: walletState.transactions.slice(0, 5),
              },
              null,
              2
            ),
          },
        ],
      };

    case "nory://services/registry":
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(
              {
                services: x402Services,
                totalCount: x402Services.length,
                categories: [...new Set(x402Services.map((s) => s.category))],
              },
              null,
              2
            ),
          },
        ],
      };

    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Nory x402 MCP Server running");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
