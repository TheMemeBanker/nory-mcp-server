# x402 Protocol Specification

**Version:** 1.0.0-draft
**Status:** Draft
**Authors:** Nory Team
**Date:** February 2025

---

## Abstract

The x402 protocol defines a standard for HTTP-native micropayments using the HTTP 402 (Payment Required) status code combined with cryptocurrency settlement. This specification enables machine-to-machine payments, allowing AI agents, autonomous systems, and web applications to transact without human intervention.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Terminology](#2-terminology)
3. [Protocol Overview](#3-protocol-overview)
4. [HTTP Headers](#4-http-headers)
5. [Payment Flow](#5-payment-flow)
6. [Payment Payload Format](#6-payment-payload-format)
7. [Supported Networks](#7-supported-networks)
8. [Security Considerations](#8-security-considerations)
9. [Error Handling](#9-error-handling)
10. [Implementation Guidelines](#10-implementation-guidelines)
11. [Examples](#11-examples)
12. [References](#12-references)

---

## 1. Introduction

### 1.1 Background

HTTP status code 402 (Payment Required) was reserved in HTTP/1.1 (RFC 2616) for future use. The original vision was to enable native payments on the web, but traditional payment rails (credit cards, bank transfers) required human intervention and couldn't support micropayments cost-effectively.

The emergence of fast-finality blockchain networks (sub-second settlement) and stablecoins (USDC, USDT) now makes the original HTTP 402 vision practical.

### 1.2 Goals

- **HTTP-native**: Use standard HTTP semantics without custom transport
- **Instant settlement**: Sub-second finality for real-time transactions
- **Micropayment-friendly**: Enable sub-cent transactions economically
- **Machine-readable**: Allow autonomous agents to transact without humans
- **Non-custodial**: Payers retain control of their funds
- **Multi-chain**: Support multiple blockchain networks

### 1.3 Use Cases

- AI agents paying for API calls
- Autonomous systems purchasing compute resources
- Machine-to-machine data marketplace transactions
- Pay-per-use content access
- Streaming payments for continuous services

---

## 2. Terminology

| Term | Definition |
|------|------------|
| **Client** | The entity making an HTTP request and initiating payment |
| **Server** | The entity serving paid resources and receiving payment |
| **Facilitator** | Optional intermediary that handles payment verification |
| **Payment Payload** | Base64-encoded JSON containing payment requirements |
| **Payment Proof** | Cryptographic proof that payment was made (transaction signature) |
| **Settlement Network** | The blockchain network where payment is settled |

---

## 3. Protocol Overview

The x402 protocol operates in four phases:

```
┌─────────┐                                    ┌─────────┐
│  Client │                                    │  Server │
└────┬────┘                                    └────┬────┘
     │                                              │
     │  1. Request paid resource                    │
     │ ─────────────────────────────────────────────>
     │                                              │
     │  2. HTTP 402 + X-Payment header              │
     │ <─────────────────────────────────────────────
     │                                              │
     │  3. Create & submit payment on-chain         │
     │ ─────────────────────────────────────────────> (Blockchain)
     │                                              │
     │  4. Retry request with X-Payment-Proof       │
     │ ─────────────────────────────────────────────>
     │                                              │
     │  5. Verify payment, return resource          │
     │ <─────────────────────────────────────────────
     │                                              │
```

---

## 4. HTTP Headers

### 4.1 Response Headers (Server → Client)

#### `X-Payment`

Contains Base64-encoded JSON with payment requirements.

```
X-Payment: eyJhY2NlcHRzIjpbey4uLn1dLCJleHBpcmVzIjoiMjAyNS0wMi0wNVQxMjowMDowMFoifQ==
```

#### `X-Payment-Networks`

Comma-separated list of supported settlement networks.

```
X-Payment-Networks: solana-mainnet, base-mainnet, polygon-mainnet
```

### 4.2 Request Headers (Client → Server)

#### `X-Payment-Proof`

Contains the payment proof (transaction signature or receipt).

```
X-Payment-Proof: 5TxM9vH2kN3pL8qR7wS1jF6gY4hU0iO2aD5sE8fG...
```

#### `X-Payment-Network`

Specifies which network the payment was made on.

```
X-Payment-Network: solana-mainnet
```

---

## 5. Payment Flow

### 5.1 Step 1: Initial Request

Client makes a standard HTTP request to a paid resource:

```http
GET /api/premium-data HTTP/1.1
Host: api.example.com
Accept: application/json
```

### 5.2 Step 2: Payment Required Response

Server returns HTTP 402 with payment requirements:

```http
HTTP/1.1 402 Payment Required
Content-Type: application/json
X-Payment: eyJhY2NlcHRzIjpbey...
X-Payment-Networks: solana-mainnet

{
  "error": "payment_required",
  "message": "This endpoint requires payment",
  "amount": "0.001",
  "currency": "USDC"
}
```

### 5.3 Step 3: Payment Execution

Client decodes the `X-Payment` header and executes payment on-chain:

1. Parse payment requirements from `X-Payment`
2. Select preferred network from supported options
3. Create transaction to recipient address
4. Sign and submit transaction
5. Wait for confirmation (typically < 1 second on Solana)

### 5.4 Step 4: Retry with Payment Proof

Client retries the original request with payment proof:

```http
GET /api/premium-data HTTP/1.1
Host: api.example.com
Accept: application/json
X-Payment-Proof: 5TxM9vH2kN3pL8qR7wS1jF6gY4hU0iO2aD5sE8fG...
X-Payment-Network: solana-mainnet
```

### 5.5 Step 5: Resource Delivery

Server verifies payment and returns the resource:

```http
HTTP/1.1 200 OK
Content-Type: application/json
X-Payment-Receipt: tx_abc123...

{
  "data": { ... }
}
```

---

## 6. Payment Payload Format

The `X-Payment` header contains a Base64-encoded JSON object:

```json
{
  "version": "1.0",
  "accepts": [
    {
      "network": "solana-mainnet",
      "token": "USDC",
      "tokenAddress": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "recipient": "GkXn9FqJ4pT1qVz8hQJ9X5nK8vL2mW...",
      "amount": "0.001",
      "decimals": 6
    },
    {
      "network": "base-mainnet",
      "token": "USDC",
      "tokenAddress": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      "recipient": "0x742d35Cc6634C0532925a3b844Bc9...",
      "amount": "0.001",
      "decimals": 6
    }
  ],
  "resource": "/api/premium-data",
  "expires": "2025-02-05T12:00:00Z",
  "nonce": "abc123xyz",
  "memo": "API call: GET /api/premium-data"
}
```

### 6.1 Field Definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | string | Yes | Protocol version (currently "1.0") |
| `accepts` | array | Yes | Array of accepted payment methods |
| `accepts[].network` | string | Yes | Settlement network identifier |
| `accepts[].token` | string | Yes | Token symbol (e.g., "USDC") |
| `accepts[].tokenAddress` | string | Yes | Token contract address |
| `accepts[].recipient` | string | Yes | Payment recipient address |
| `accepts[].amount` | string | Yes | Amount in human-readable form |
| `accepts[].decimals` | number | Yes | Token decimal places |
| `resource` | string | No | Resource path being purchased |
| `expires` | string | No | ISO 8601 expiration timestamp |
| `nonce` | string | No | Unique identifier to prevent replay |
| `memo` | string | No | Optional memo for the transaction |

---

## 7. Supported Networks

### 7.1 Network Identifiers

| Identifier | Network | Settlement Time |
|------------|---------|-----------------|
| `solana-mainnet` | Solana Mainnet | ~400ms |
| `solana-devnet` | Solana Devnet | ~400ms |
| `base-mainnet` | Base L2 | ~2s |
| `polygon-mainnet` | Polygon PoS | ~2s |
| `arbitrum-mainnet` | Arbitrum One | ~2s |
| `optimism-mainnet` | Optimism | ~2s |
| `ethereum-mainnet` | Ethereum L1 | ~12s |

### 7.2 Supported Tokens

Primary supported token: **USDC** (Circle's USD Coin)

Token addresses by network:

| Network | USDC Address |
|---------|--------------|
| Solana | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` |
| Base | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| Polygon | `0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359` |
| Arbitrum | `0xaf88d065e77c8cC2239327C5EDb3A432268e5831` |
| Optimism | `0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85` |
| Ethereum | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` |

---

## 8. Security Considerations

### 8.1 Payment Verification

Servers MUST verify payments before delivering resources:

1. **Transaction exists**: Confirm transaction is on-chain
2. **Correct recipient**: Payment went to expected address
3. **Correct amount**: Payment amount matches requirements
4. **Correct token**: Payment used expected token
5. **Transaction finality**: Wait for sufficient confirmations

### 8.2 Replay Protection

- Use unique `nonce` values for each payment request
- Track used nonces to prevent replay attacks
- Set reasonable `expires` timestamps (recommended: 5-15 minutes)

### 8.3 Amount Validation

- Always validate amounts on the server side
- Don't trust client-provided payment amounts
- Use precise decimal arithmetic to avoid rounding errors

### 8.4 Network Validation

- Verify the payment occurred on a supported network
- Match the `X-Payment-Network` header to actual transaction

---

## 9. Error Handling

### 9.1 HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success - payment verified, resource delivered |
| `400` | Bad Request - malformed payment proof |
| `402` | Payment Required - no/insufficient payment |
| `408` | Request Timeout - payment expired |
| `409` | Conflict - payment already used (replay) |
| `422` | Unprocessable - payment verification failed |
| `502` | Bad Gateway - blockchain network error |

### 9.2 Error Response Format

```json
{
  "error": "payment_verification_failed",
  "message": "Transaction amount does not match required payment",
  "details": {
    "required": "0.001",
    "received": "0.0005",
    "currency": "USDC"
  }
}
```

---

## 10. Implementation Guidelines

### 10.1 For Servers

1. Return informative 402 responses with clear payment requirements
2. Support multiple networks when possible for client flexibility
3. Implement idempotency - same payment proof should return same response
4. Cache verified payments to avoid re-verification
5. Log all payment events for auditing

### 10.2 For Clients

1. Parse and validate payment requirements before paying
2. Check wallet balance before attempting payment
3. Implement retry logic for temporary network failures
4. Store payment proofs for dispute resolution
5. Support user-configurable spending limits

### 10.3 For Facilitators

1. Provide fast payment verification (< 500ms)
2. Support webhook notifications for payment events
3. Offer payment receipt APIs for auditing
4. Implement rate limiting to prevent abuse

---

## 11. Examples

### 11.1 cURL Example

```bash
# Step 1: Initial request (receives 402)
curl -i https://api.example.com/premium-data

# Step 2: Retry with payment proof
curl -i https://api.example.com/premium-data \
  -H "X-Payment-Proof: 5TxM9vH2kN3pL8qR7wS1jF6gY4hU0iO2aD5sE8fG..." \
  -H "X-Payment-Network: solana-mainnet"
```

### 11.2 JavaScript Example

```javascript
async function x402Request(url, options = {}) {
  // Initial request
  let response = await fetch(url, options);

  // Handle 402 Payment Required
  if (response.status === 402) {
    const paymentHeader = response.headers.get('X-Payment');
    const requirements = JSON.parse(atob(paymentHeader));

    // Execute payment (using Nory or direct wallet)
    const paymentProof = await executePayment(requirements);

    // Retry with payment proof
    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'X-Payment-Proof': paymentProof.signature,
        'X-Payment-Network': paymentProof.network,
      },
    });
  }

  return response;
}
```

### 11.3 Python Example

```python
import base64
import json
import httpx

async def x402_request(url: str, method: str = "GET") -> dict:
    async with httpx.AsyncClient() as client:
        # Initial request
        response = await client.request(method, url)

        # Handle 402 Payment Required
        if response.status_code == 402:
            payment_header = response.headers.get("X-Payment")
            requirements = json.loads(base64.b64decode(payment_header))

            # Execute payment
            payment_proof = await execute_payment(requirements)

            # Retry with payment proof
            response = await client.request(
                method,
                url,
                headers={
                    "X-Payment-Proof": payment_proof["signature"],
                    "X-Payment-Network": payment_proof["network"],
                },
            )

        return response.json()
```

---

## 12. References

- [RFC 2616 - HTTP/1.1](https://tools.ietf.org/html/rfc2616) - HTTP 402 status code reservation
- [RFC 7231 - HTTP/1.1 Semantics](https://tools.ietf.org/html/rfc7231) - HTTP semantics
- [Solana Documentation](https://docs.solana.com/) - Solana network reference
- [USDC Documentation](https://www.circle.com/en/usdc) - USDC stablecoin reference
- [Nory x402 Implementation](https://noryx402.com/docs) - Reference implementation

---

## Appendix A: Payment Payload Schema (JSON Schema)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["version", "accepts"],
  "properties": {
    "version": {
      "type": "string",
      "pattern": "^[0-9]+\\.[0-9]+$"
    },
    "accepts": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["network", "token", "tokenAddress", "recipient", "amount", "decimals"],
        "properties": {
          "network": {"type": "string"},
          "token": {"type": "string"},
          "tokenAddress": {"type": "string"},
          "recipient": {"type": "string"},
          "amount": {"type": "string", "pattern": "^[0-9]+(\\.[0-9]+)?$"},
          "decimals": {"type": "integer", "minimum": 0, "maximum": 18}
        }
      }
    },
    "resource": {"type": "string"},
    "expires": {"type": "string", "format": "date-time"},
    "nonce": {"type": "string"},
    "memo": {"type": "string", "maxLength": 256}
  }
}
```

---

## Appendix B: Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0-draft | 2025-02 | Initial draft specification |

---

*This specification is open for community feedback and contributions.*

*Contact: spec@noryx402.com*
*GitHub: github.com/nory/x402-spec*
