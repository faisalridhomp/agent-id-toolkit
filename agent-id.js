// agent-id-toolkit — helpers for SPACE ID Agent IDs on BNB Chain.
//
// An Agent ID is a .ai handle (e.g. jackdefi.ai) registered as an NFT in the
// SPACE ID Agent ID registry. Many free mints gate on it. This module gives
// you the three facts every gate checks:
//   1. agentId bytes32  = keccak256(handle without ".ai")
//   2. registry contract + the Agent ID NFT tokenId for a handle
//   3. whether a wallet owns that tokenId
//
// Usage:
//   node agent-id.js jackdefi            -> prints agentId, registry, tokenId
//   node agent-id.js jackdefi 0xWALLET   -> also checks ownership
// Requires: ethers (npm i ethers). Public BSC RPC, no key needed.

const { ethers } = require("ethers");

const RPC = "https://bsc.publicnode.com";
const REGISTRY = "0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F";
const REGISTRY_ABI = [
    "function ownerOf(uint256) view returns (address)",
    "function tokenIdOf(string) view returns (uint256)",
];

function agentIdBytes32(handle) {
    const name = handle.replace(/\.ai$/i, "");
    return ethers.keccak256(ethers.toUtf8Bytes(name));
}

async function main() {
    const [handle, wallet] = process.argv.slice(2);
    if (!handle) {
        console.log("Usage: node agent-id.js <handle> [walletAddress]");
        console.log("Example: node agent-id.js jackdefi 0x3Bc96b2528f686F27b04897bD819bC10D8981B1b");
        process.exit(1);
    }
    const name = handle.replace(/\.ai$/i, "");
    console.log(`handle: ${name}.ai`);
    console.log(`agentId (bytes32): ${agentIdBytes32(name)}`);
    console.log(`registry: ${REGISTRY}`);

    const provider = new ethers.JsonRpcProvider(RPC);
    const reg = new ethers.Contract(REGISTRY, REGISTRY_ABI, provider);
    let tokenId;
    try {
        tokenId = await reg.tokenIdOf(name);
        console.log(`Agent ID tokenId: ${tokenId.toString()}`);
    } catch (e) {
        console.log("tokenIdOf not available on this registry — use ownerOf with a known tokenId.");
    }
    if (wallet && tokenId !== undefined) {
        const owner = await reg.ownerOf(tokenId);
        const owns = owner.toLowerCase() === wallet.toLowerCase();
        console.log(`ownerOf(tokenId): ${owner}`);
        console.log(owns ? "=> wallet OWNS this Agent ID." : "=> wallet does NOT own this Agent ID.");
    }
}

main().catch((e) => { console.error("error:", e.shortMessage || e.message); process.exit(1); });

module.exports = { agentIdBytes32, REGISTRY };
