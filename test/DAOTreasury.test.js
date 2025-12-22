const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DAOTreasury", function () {
    let treasury, timelock;
    let owner, addr1, addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy a simple timelock for testing
        const TimelockController = await ethers.getContractFactory("TimelockController");
        timelock = await TimelockController.deploy(
            1, // min delay
            [owner.address], // proposers
            [owner.address], // executors
            owner.address // admin
        );
        await timelock.waitForDeployment();

        // Deploy Treasury
        const DAOTreasury = await ethers.getContractFactory("DAOTreasury");
        treasury = await DAOTreasury.deploy(await timelock.getAddress());
        await treasury.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the correct owner", async function () {
            expect(await treasury.owner()).to.equal(await timelock.getAddress());
        });

        it("Should start with zero balance", async function () {
            expect(await treasury.getBalance()).to.equal(0);
        });
    });

    describe("Receiving Funds", function () {
        it("Should receive ETH", async function () {
            const amount = ethers.parseEther("1.0");

            await expect(
                owner.sendTransaction({
                    to: await treasury.getAddress(),
                    value: amount,
                })
            ).to.changeEtherBalance(treasury, amount);
        });

        it("Should emit FundsReceived event", async function () {
            const amount = ethers.parseEther("1.0");

            await expect(
                owner.sendTransaction({
                    to: await treasury.getAddress(),
                    value: amount,
                })
            ).to.emit(treasury, "FundsReceived")
                .withArgs(owner.address, amount);
        });
    });

    describe("Withdrawals", function () {
        beforeEach(async function () {
            // Fund the treasury
            await owner.sendTransaction({
                to: await treasury.getAddress(),
                value: ethers.parseEther("10.0"),
            });
        });

        it("Should allow owner to withdraw", async function () {
            const amount = ethers.parseEther("1.0");

            // Call from timelock (owner)
            const withdrawData = treasury.interface.encodeFunctionData("withdraw", [
                addr1.address,
                amount,
            ]);

            await timelock.execute(
                await treasury.getAddress(),
                0,
                withdrawData,
                ethers.ZeroHash,
                ethers.ZeroHash
            );

            expect(await treasury.getBalance()).to.equal(ethers.parseEther("9.0"));
        });

        it("Should not allow non-owner to withdraw", async function () {
            const amount = ethers.parseEther("1.0");

            await expect(
                treasury.connect(addr1).withdraw(addr2.address, amount)
            ).to.be.reverted;
        });

        it("Should revert on insufficient balance", async function () {
            const amount = ethers.parseEther("20.0");

            const withdrawData = treasury.interface.encodeFunctionData("withdraw", [
                addr1.address,
                amount,
            ]);

            await expect(
                timelock.execute(
                    await treasury.getAddress(),
                    0,
                    withdrawData,
                    ethers.ZeroHash,
                    ethers.ZeroHash
                )
            ).to.be.reverted;
        });
    });

    describe("Fund Allocation", function () {
        beforeEach(async function () {
            await owner.sendTransaction({
                to: await treasury.getAddress(),
                value: ethers.parseEther("10.0"),
            });
        });

        it("Should allocate funds with purpose", async function () {
            const amount = ethers.parseEther("1.0");
            const purpose = "Development grant";

            const allocateData = treasury.interface.encodeFunctionData("allocateFunds", [
                addr1.address,
                amount,
                purpose,
            ]);

            await expect(
                timelock.execute(
                    await treasury.getAddress(),
                    0,
                    allocateData,
                    ethers.ZeroHash,
                    ethers.ZeroHash
                )
            ).to.emit(treasury, "FundsAllocated")
                .withArgs(addr1.address, amount, purpose);
        });
    });
});
