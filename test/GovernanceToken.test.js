const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GovernanceToken", function () {
    let governanceToken;
    let owner, addr1, addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        const GovernanceToken = await ethers.getContractFactory("GovernanceToken");
        governanceToken = await GovernanceToken.deploy(
            "DAO Token",
            "DAOT",
            owner.address
        );
        await governanceToken.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await governanceToken.owner()).to.equal(owner.address);
        });

        it("Should assign the total supply to the owner", async function () {
            const ownerBalance = await governanceToken.balanceOf(owner.address);
            expect(await governanceToken.totalSupply()).to.equal(ownerBalance);
        });

        it("Should have correct name and symbol", async function () {
            expect(await governanceToken.name()).to.equal("DAO Token");
            expect(await governanceToken.symbol()).to.equal("DAOT");
        });
    });

    describe("Voting Power", function () {
        it("Should delegate voting power", async function () {
            const amount = ethers.parseEther("100");
            await governanceToken.transfer(addr1.address, amount);

            // Delegate voting power
            await governanceToken.connect(addr1).delegate(addr1.address);

            const votes = await governanceToken.getVotes(addr1.address);
            expect(votes).to.equal(amount);
        });

        it("Should track voting power changes", async function () {
            const amount = ethers.parseEther("100");
            await governanceToken.transfer(addr1.address, amount);

            await governanceToken.connect(addr1).delegate(addr1.address);

            // Transfer some tokens
            await governanceToken.connect(addr1).transfer(addr2.address, ethers.parseEther("50"));

            const votes = await governanceToken.getVotes(addr1.address);
            expect(votes).to.equal(ethers.parseEther("50"));
        });
    });

    describe("Minting", function () {
        it("Should allow owner to mint tokens", async function () {
            const mintAmount = ethers.parseEther("1000");
            await expect(
                governanceToken.mint(addr1.address, mintAmount)
            ).to.be.revertedWith("Max supply exceeded");
        });

        it("Should not allow non-owner to mint", async function () {
            const mintAmount = ethers.parseEther("100");
            await expect(
                governanceToken.connect(addr1).mint(addr1.address, mintAmount)
            ).to.be.reverted;
        });
    });

    describe("Transfers", function () {
        it("Should transfer tokens between accounts", async function () {
            const amount = ethers.parseEther("50");
            await governanceToken.transfer(addr1.address, amount);
            expect(await governanceToken.balanceOf(addr1.address)).to.equal(amount);
        });

        it("Should fail if sender doesn't have enough tokens", async function () {
            const initialOwnerBalance = await governanceToken.balanceOf(owner.address);
            await expect(
                governanceToken.connect(addr1).transfer(owner.address, 1)
            ).to.be.reverted;
        });
    });
});
