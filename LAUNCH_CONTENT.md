# Nory MCP Server Launch Content

## 1. TWITTER/X ANNOUNCEMENT

### Main Tweet:
```
🚀 Introducing: Nory MCP Server

Give any AI agent the ability to pay.

One npm install. Instant x402 payments.

npm install nory-mcp-server

Your AI can now:
• Check wallet balances
• Make instant payments
• Access paid APIs automatically
• Discover x402 services

The future where AI agents are consumers starts now.
```

### Thread (Reply 1):
```
How it works:

1. Install: npm install nory-mcp-server
2. Add to Claude config
3. Your AI now has a wallet

"Hey Claude, pay 0.50 USDC to this address"
"Access this premium API for me"
"What's my balance?"

All handled automatically. Sub-second settlements.
```

### Thread (Reply 2):
```
Why this matters:

AI agents are becoming autonomous consumers.

They need to:
- Pay for API calls
- Access premium data
- Purchase compute
- Tip other agents

Traditional payment rails weren't built for this.

x402 + MCP = native AI payments.
```

### Thread (Reply 3):
```
Built on the x402 protocol:

• HTTP 402 status code for payments
• Sub-second Solana settlements
• Non-custodial (your keys, your control)
• Works with Claude, ChatGPT, any MCP agent

Try it now: npmjs.com/package/nory-mcp-server

Docs: noryx402.com
```

---

## 2. REDDIT POSTS

### r/LocalLLaMA, r/MachineLearning, r/artificial

**Title:** I built an MCP server that lets AI agents make instant crypto payments

**Body:**
```
Hey everyone,

I've been thinking about a weird problem: AI agents are becoming more autonomous, but they can't spend money.

If an agent needs to:
- Call a premium API
- Access paid data
- Buy compute time
- Pay for services

...it's stuck. Traditional payment rails require human intervention.

So I built the Nory MCP Server.

It's a Model Context Protocol server that gives any AI assistant (Claude, etc.) the ability to make instant micropayments using x402 (HTTP 402 + crypto).

**What it does:**
- `nory_check_balance` - Check wallet funds
- `nory_pay` - Direct payments to any address
- `nory_x402_request` - Access paid APIs with automatic payment
- `nory_discover_services` - Find x402-enabled services

**How to use:**
```
npm install nory-mcp-server
```

Add to your Claude config and your AI has a wallet.

The payments settle on Solana in under a second. Non-custodial - your keys stay on your machine.

I think this is the beginning of "AI agents as consumers" - a new economic paradigm where agents transact autonomously.

Curious what you all think. Is this useful? What would you build with it?

Link: https://npmjs.com/package/nory-mcp-server
```

### r/solana, r/cryptocurrency

**Title:** Built an MCP server for AI agent payments on Solana - sub-second settlements

**Body:**
```
Just shipped something I'm excited about: Nory MCP Server

It lets AI agents (Claude, etc.) make instant payments using the x402 protocol on Solana.

Why Solana? Sub-second finality. An AI agent can request, pay, and receive a response in under a second.

The protocol:
1. Agent requests paid resource
2. Server returns HTTP 402 with payment requirements
3. Agent pays via Nory (USDC on Solana)
4. Settlement in ~400ms
5. Agent gets the resource

Use cases:
- AI paying for API calls
- Autonomous agents buying compute
- Machine-to-machine micropayments
- Agent-to-agent tipping

npm install nory-mcp-server

This is the infrastructure for AI agents to become economic actors.

Thoughts?
```

---

## 3. DISCORD POSTS

### LangChain Discord (#showcase or #general)

```
👋 Hey LangChain community!

Just released something that might interest agent builders:

**Nory MCP Server** - Give your agents the ability to make instant payments

The problem: Agents need to pay for things (APIs, compute, data) but can't.

The solution: An MCP server that handles x402 payments automatically.

Your agent can now:
• Check balances
• Make direct payments
• Access paid APIs (payment handled automatically)
• Discover x402 services

Works with any MCP-compatible setup. Settlements on Solana in <1 second.

`npm install nory-mcp-server`

Would love to explore native LangChain integration if there's interest!

Docs: https://noryx402.com
npm: https://npmjs.com/package/nory-mcp-server
```

### Daydreams Discord

```
🤖 New tool for Daydreams agents: Nory MCP Server

Lets any agent make instant x402 payments.

npm install nory-mcp-server

Your agents can now:
- Pay for API calls automatically
- Access x402-gated resources
- Transact with other agents
- Manage a crypto wallet

This is the missing piece for autonomous agent economics.

Sub-second settlements on Solana. Non-custodial.

Happy to discuss native Daydreams integration!

https://noryx402.com
```

### CrewAI Discord

```
Hey CrewAI builders 👋

Shipped an MCP server for agent payments: nory-mcp-server

Problem: Your crews can't pay for things autonomously
Solution: x402 micropayments via MCP

Use cases:
- Crew members paying for API calls
- Inter-agent payments
- Accessing premium data sources
- Autonomous purchasing

npm install nory-mcp-server

Interested in exploring CrewAI integration. Who should I talk to?
```

---

## 4. OUTREACH EMAILS

### To: LangChain Team

**Subject:** Native payment capabilities for LangChain agents?

```
Hi LangChain team,

I've been building with LangChain and noticed a gap: agents can do almost anything except spend money.

I just released Nory MCP Server (npm: nory-mcp-server) which gives AI agents instant payment capabilities using the x402 protocol.

The value prop for LangChain users:
- Agents can pay for API calls automatically
- Access premium data sources
- Machine-to-machine micropayments
- Non-custodial, sub-second settlements on Solana

I'd love to explore what native LangChain integration could look like. A few ideas:
1. Payment tool in the standard toolkit
2. x402-aware HTTP client
3. Agent wallet primitive

Would anyone on your team be interested in a quick call?

Best,
[Name]

P.S. Live demo at noryx402.com, npm package at npmjs.com/package/nory-mcp-server
```

### To: Daydreams Team

**Subject:** Payment layer for Daydreams agents

```
Hey Daydreams team,

Love what you're building with autonomous agents.

I just shipped Nory MCP Server - it gives any agent instant x402 payment capabilities. Thought it might be a natural fit for Daydreams.

What it enables:
- Agents paying for resources autonomously
- Agent-to-agent transactions
- Access to x402-gated APIs and services
- Sub-second Solana settlements

I'd love to explore native Daydreams integration. Could be as simple as a payment extension or deeper wallet integration.

Open to a call to discuss?

npm: nory-mcp-server
Site: noryx402.com

Best,
[Name]
```

### To: Anthropic/Claude Team (if you have contacts)

**Subject:** MCP server for Claude payments - x402 protocol

```
Hi,

I built an MCP server that gives Claude instant payment capabilities: nory-mcp-server

It implements the x402 protocol (HTTP 402 + crypto micropayments) via MCP tools.

Claude can now:
- Check wallet balances
- Make payments to any address
- Access x402-gated APIs automatically
- Discover paid services

This feels like an important primitive for the "AI agents as consumers" future.

Would love to get feedback or explore if this is something worth featuring in MCP documentation/examples.

npm: nory-mcp-server
Demo: noryx402.com

Thanks,
[Name]
```

---

## 5. HACKER NEWS POST

**Title:** Show HN: MCP server that lets AI agents make instant crypto payments

**Body:**
```
I built Nory MCP Server to solve a problem: AI agents can't spend money.

As agents become more autonomous, they need to pay for things:
- API calls
- Premium data
- Compute resources
- Services from other agents

Traditional payment rails (credit cards, OAuth) require human intervention and weren't designed for machine-to-machine transactions.

Nory MCP Server implements the x402 protocol (HTTP 402 status code + crypto payments) via Model Context Protocol tools.

How it works:
1. Agent requests a paid resource
2. Server returns 402 with payment requirements
3. Agent creates signed Solana transaction
4. Settlement in ~400ms
5. Agent receives the resource

The MCP server exposes 5 tools:
- nory_check_balance
- nory_pay
- nory_x402_request (handles the full 402 flow)
- nory_discover_services
- nory_payment_history

Install: npm install nory-mcp-server

Non-custodial (keys stay on your machine), sub-second settlements, works with Claude and any MCP-compatible agent.

I think this is early infrastructure for a future where AI agents are economic actors.

Feedback welcome.

npm: https://npmjs.com/package/nory-mcp-server
Site: https://noryx402.com
```
