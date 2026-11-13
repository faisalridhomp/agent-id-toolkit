# agent-id-toolkit

Helpers for SPACE ID Agent IDs on BNB Chain.

An Agent ID is a `.ai` handle (e.g. `jackdefi.ai`) registered as an NFT in
the SPACE ID Agent ID registry. Many free mints gate on it — the contract
checks that the caller's wallet owns the Agent ID token for the handle.

## What it gives you

- `agentId` bytes32 = `keccak256(handle)` (handle without `.ai`)
- The registry contract address
- The Agent ID NFT `tokenId` for a handle
- Whether a wallet owns that `tokenId`

## Usage

```bash
npm i ethers
node agent-id.js jackdefi
node agent-id.js jackdefi 0x3Bc96b2528f686F27b04897bD819bC10D8981B1b
```

Example output:

```
handle: jackdefi.ai
agentId (bytes32): 0x7f170a6eb0e15ba07bced8cebe7d595bf2f0108a4ba59c90f7301dcec954bf3e
registry: 0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F
Agent ID tokenId: 57484441254250005658950287098154019031945410633065887588232514791239975223102
ownerOf(tokenId): 0x3Bc96b2528f686F27b04897bD819bC10D8981B1b
=> wallet OWNS this Agent ID.
```

Use it as a library too: `require('./agent-id.js')` exports
`agentIdBytes32` and `REGISTRY`.
