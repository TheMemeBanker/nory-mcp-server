# MCP Registry Submission Guide

## Overview

This document outlines how to submit the Nory MCP Server to the official Model Context Protocol Registry.

## Prerequisites

1. GitHub account with access to nory organization
2. npm package already published (`nory-mcp-server@0.1.0`)
3. MCP Publisher CLI

## Step 1: Install the Publisher CLI

```bash
# Clone the registry repo
git clone https://github.com/modelcontextprotocol/registry.git
cd registry

# Build the publisher
make publisher

# Or download from releases
# https://github.com/modelcontextprotocol/registry/releases
```

## Step 2: Authenticate with GitHub

```bash
./bin/mcp-publisher login --github
```

This will open a browser for GitHub OAuth. The namespace `io.github.nory` requires you to be authenticated as a member of the `nory` GitHub organization.

## Step 3: Validate server.json

```bash
./bin/mcp-publisher validate ./server.json
```

Ensure the server.json file passes validation before submission.

## Step 4: Publish to Registry

```bash
./bin/mcp-publisher publish ./server.json
```

## Step 5: Verify Listing

After publishing, verify the server appears at:
- https://registry.modelcontextprotocol.io/servers/io.github.nory/nory-mcp-server

## server.json Reference

The `server.json` file in this repo contains:

```json
{
  "name": "nory-mcp-server",
  "namespace": "io.github.nory",
  "version": "0.1.0",
  "title": "Nory x402 Payments",
  "description": "Give any AI agent the ability to make instant payments...",
  ...
}
```

## Updating the Registry Entry

To update the listing (e.g., new version):

1. Update version in `package.json` and `server.json`
2. Publish new npm version: `npm publish`
3. Re-run: `./bin/mcp-publisher publish ./server.json`

## Alternative: Smithery Registry

Smithery is another popular MCP server registry:

1. Go to https://smithery.ai/
2. Click "Add Server"
3. Provide npm package name: `nory-mcp-server`
4. Fill in details and submit

## Alternative: MCPServers.com

Submit at https://mcpservers.com/submit with:
- Name: Nory x402 Payments
- Package: nory-mcp-server
- Description: AI agent payment capabilities via x402 protocol
- Category: Finance / Blockchain

## Resources

- [MCP Registry Docs](https://registry.modelcontextprotocol.io/docs)
- [Publishing Guide](https://modelcontextprotocol.info/tools/registry/publishing/)
- [Registry GitHub](https://github.com/modelcontextprotocol/registry)
