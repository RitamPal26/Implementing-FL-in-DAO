const { ethers } = require("hardhat");

async function main() {
    // This script demonstrates the full governance flow
    const fs = require("fs");
    const deploymentInfo = JSON.parse(fs.readFileSync("./deployments.json"));

    const [voter] = await ethers.getSigners();
    const governor = await ethers.getContractAt(
        "DAOGovernor",
        deploymentInfo.contracts.governor
    );

    console.log("Interacting with Governor at:", await governor.getAddress());
    console.log("Voter address:", voter.address);

    // Example: Get voting power
    const votingPower = await governor.getVotes(
        voter.address,
        await ethers.provider.getBlockNumber() - 1
    );
    console.log(
        "\nYour voting power:",
        ethers.formatEther(votingPower),
        "votes"
    );

    // Add proposal ID here to interact with a specific proposal
    const PROPOSAL_ID = process.argv[2];

    if (!PROPOSAL_ID) {
        console.log("\nUsage: npx hardhat run scripts/interact.js <proposalId>");
        console.log(
            "\nTo vote: VoteType 0 = Against, 1 = For, 2 = Abstain"
        );
        return;
    }

    console.log("\nProposal ID:", PROPOSAL_ID);
    console.log("Proposal state:", await governor.state(PROPOSAL_ID));

    // Cast a vote (0 = Against, 1 = For, 2 = Abstain)
    const voteType = 1; // Vote "For"
    console.log("\nCasting vote...");
    const voteTx = await governor.castVote(PROPOSAL_ID, voteType);
    await voteTx.wait();
    console.log("✅ Vote cast successfully!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
