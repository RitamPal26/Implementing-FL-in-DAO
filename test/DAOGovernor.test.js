const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DAOGovernor", function () {
    let governanceToken, timelock, governor, treasury;
    let owner, addr1, addr2;

    const VOTING_DELAY = 1;
    const VOTING_PERIOD = 50;
    const PROPOSAL_THRESHOLD = ethers.parseEther("100");
    const QUORUM_PERCENTAGE = 4;
    const MIN_DELAY = 1;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy Governance Token
        const GovernanceToken = await ethers.getContractFactory("GovernanceToken");
        governanceToken = await GovernanceToken.deploy(
            "DAO Token",
            "DAOT",
            owner.address
        );
        await governanceToken.waitForDeployment();

        // Delegate voting power
        await governanceToken.delegate(owner.address);

        // Deploy Timelock
        const TimelockController = await ethers.getContractFactory("TimelockController");
        timelock = await TimelockController.deploy(
            MIN_DELAY,
            [],
            [],
            owner.address
        );
        await timelock.waitForDeployment();

        // Deploy Governor
        const DAOGovernor = await ethers.getContractFactory("DAOGovernor");
        governor = await DAOGovernor.deploy(
            await governanceToken.getAddress(),
            await timelock.getAddress(),
            VOTING_DELAY,
            VOTING_PERIOD,
            PROPOSAL_THRESHOLD,
            QUORUM_PERCENTAGE
        );
        await governor.waitForDeployment();

        // Setup roles
        const PROPOSER_ROLE = await timelock.PROPOSER_ROLE();
        const EXECUTOR_ROLE = await timelock.EXECUTOR_ROLE();
        const CANCELLER_ROLE = await timelock.CANCELLER_ROLE();

        await timelock.grantRole(PROPOSER_ROLE, await governor.getAddress());
        await timelock.grantRole(EXECUTOR_ROLE, await governor.getAddress());
        await timelock.grantRole(CANCELLER_ROLE, await governor.getAddress());

        // Deploy Treasury
        const DAOTreasury = await ethers.getContractFactory("DAOTreasury");
        treasury = await DAOTreasury.deploy(await timelock.getAddress());
        await treasury.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the correct parameters", async function () {
            expect(await governor.votingDelay()).to.equal(VOTING_DELAY);
            expect(await governor.votingPeriod()).to.equal(VOTING_PERIOD);
            expect(await governor.proposalThreshold()).to.equal(PROPOSAL_THRESHOLD);
        });

        it("Should have correct token", async function () {
            expect(await governor.token()).to.equal(await governanceToken.getAddress());
        });
    });

    describe("Proposals", function () {
        it("Should create a proposal", async function () {
            const transferCalldata = treasury.interface.encodeFunctionData("withdraw", [
                addr1.address,
                ethers.parseEther("0.1"),
            ]);

            const proposeTx = await governor.propose(
                [await treasury.getAddress()],
                [0],
                [transferCalldata],
                "Proposal #1: Withdraw funds"
            );

            const receipt = await proposeTx.wait();
            const proposalId = receipt.logs[0].args.proposalId;

            expect(await governor.state(proposalId)).to.equal(0); // Pending
        });

        it("Should not allow proposals below threshold", async function () {
            // Transfer some tokens to addr1 (below threshold)
            await governanceToken.transfer(addr1.address, ethers.parseEther("50"));
            await governanceToken.connect(addr1).delegate(addr1.address);

            const transferCalldata = treasury.interface.encodeFunctionData("withdraw", [
                addr2.address,
                ethers.parseEther("0.1"),
            ]);

            await expect(
                governor.connect(addr1).propose(
                    [await treasury.getAddress()],
                    [0],
                    [transferCalldata],
                    "Proposal by addr1"
                )
            ).to.be.reverted;
        });
    });

    describe("Voting", function () {
        let proposalId;

        beforeEach(async function () {
            const transferCalldata = treasury.interface.encodeFunctionData("withdraw", [
                addr1.address,
                ethers.parseEther("0.1"),
            ]);

            const proposeTx = await governor.propose(
                [await treasury.getAddress()],
                [0],
                [transferCalldata],
                "Test Proposal"
            );

            const receipt = await proposeTx.wait();
            proposalId = receipt.logs[0].args.proposalId;

            // Move past voting delay
            for (let i = 0; i < VOTING_DELAY + 1; i++) {
                await ethers.provider.send("evm_mine");
            }
        });

        it("Should allow voting on active proposal", async function () {
            expect(await governor.state(proposalId)).to.equal(1); // Active

            await governor.castVote(proposalId, 1); // Vote For

            const hasVoted = await governor.hasVoted(proposalId, owner.address);
            expect(hasVoted).to.be.true;
        });

        it("Should count votes correctly", async function () {
            await governor.castVote(proposalId, 1); // Vote For

            const proposalVotes = await governor.proposalVotes(proposalId);
            expect(proposalVotes.forVotes).to.be.gt(0);
        });
    });
});
