// Helper functions for DAO interactions

const { ethers } = require("hardhat");

/**
 * Get proposal state as string
 */
function getProposalState(state) {
    const states = [
        "Pending",
        "Active",
        "Canceled",
        "Defeated",
        "Succeeded",
        "Queued",
        "Expired",
        "Executed",
    ];
    return states[state] || "Unknown";
}

/**
 * Get vote type as string
 */
function getVoteType(voteType) {
    const types = ["Against", "For", "Abstain"];
    return types[voteType] || "Unknown";
}

/**
 * Calculate proposal ID
 */
function getProposalId(targets, values, calldatas, descriptionHash) {
    return ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
            ["address[]", "uint256[]", "bytes[]", "bytes32"],
            [targets, values, calldatas, descriptionHash]
        )
    );
}

/**
 * Get description hash
 */
function getDescriptionHash(description) {
    return ethers.keccak256(ethers.toUtf8Bytes(description));
}

/**
 * Format voting power
 */
function formatVotes(votes) {
    return ethers.formatEther(votes);
}

/**
 * Check if address has enough voting power for proposal
 */
async function canPropose(governor, address, blockNumber) {
    const threshold = await governor.proposalThreshold();
    const votes = await governor.getVotes(address, blockNumber);
    return votes >= threshold;
}

/**
 * Get proposal details
 */
async function getProposalDetails(governor, proposalId) {
    const state = await governor.state(proposalId);
    const votes = await governor.proposalVotes(proposalId);
    const deadline = await governor.proposalDeadline(proposalId);
    const snapshot = await governor.proposalSnapshot(proposalId);

    return {
        state: getProposalState(state),
        stateValue: state,
        forVotes: formatVotes(votes.forVotes),
        againstVotes: formatVotes(votes.againstVotes),
        abstainVotes: formatVotes(votes.abstainVotes),
        deadline: deadline.toString(),
        snapshot: snapshot.toString(),
    };
}

/**
 * Wait for blocks
 */
async function mineBlocks(count) {
    for (let i = 0; i < count; i++) {
        await ethers.provider.send("evm_mine");
    }
    console.log(`Mined ${count} blocks`);
}

/**
 * Get current block number
 */
async function getCurrentBlock() {
    return await ethers.provider.getBlockNumber();
}

module.exports = {
    getProposalState,
    getVoteType,
    getProposalId,
    getDescriptionHash,
    formatVotes,
    canPropose,
    getProposalDetails,
    mineBlocks,
    getCurrentBlock,
};
