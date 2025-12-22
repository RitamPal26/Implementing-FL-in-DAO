# Quick Start Guide

Get your DAO up and running in 5 minutes!

## Prerequisites

- Node.js v16+ installed
- MetaMask or similar Web3 wallet
- Basic understanding of Ethereum and smart contracts

## Step 1: Install Dependencies

```bash
cd /data/Major\ Project/DAO
npm install
```

## Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your private key for testnet deployment (optional).

## Step 3: Compile Contracts

```bash
npx hardhat compile
```

You should see:
```
Compiled 10 Solidity files successfully
```

## Step 4: Run Tests

```bash
npx hardhat test
```

All tests should pass ✅

## Step 5: Deploy Locally

Terminal 1 - Start local blockchain:
```bash
npx hardhat node
```

Terminal 2 - Deploy contracts:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

You'll see output with contract addresses. Save these!

## Step 6: Interact with Your DAO

### Delegate Voting Power
```bash
# In Hardhat console
npx hardhat console --network localhost

# Then run:
const token = await ethers.getContractAt("GovernanceToken", "TOKEN_ADDRESS")
await token.delegate(await token.signer.getAddress())
```

### Create a Proposal
```bash
npx hardhat run scripts/createProposal.js --network localhost
```

### Vote on a Proposal
```bash
npx hardhat run scripts/interact.js PROPOSAL_ID --network localhost
```

## What's Next?

### Learn More
- Read [Architecture](docs/ARCHITECTURE.md) to understand the system
- Check [Usage Guide](docs/USAGE.md) for detailed instructions
- Review [Security](docs/SECURITY.md) best practices

### Customize Your DAO
Edit `config/governance-params.json` to adjust:
- Voting periods
- Proposal thresholds
- Quorum requirements
- Timelock delays

### Deploy to Testnet

1. Get testnet ETH from faucet
2. Update `.env` with RPC URL and private key
3. Deploy:
```bash
npx hardhat run scripts/deploy.js --network goerli
```

### Build a Frontend

Use the template in `frontend/index.html` as a starting point.

## Common Commands

```bash
# Compile contracts
npm run compile

# Run tests
npm test

# Run tests with coverage
npm run coverage

# Deploy to local network
npm run deploy:local

# Start local blockchain
npm run node

# Clean artifacts
npm run clean
```

## Troubleshooting

### "Cannot find module"
```bash
npm install
```

### "Insufficient funds"
Make sure your account has ETH on the network you're deploying to.

### "Nonce too high"
Reset MetaMask: Settings → Advanced → Reset Account

### Tests failing
```bash
npm run clean
npm run compile
npm test
```

## Example Workflow

Here's a complete example of the governance flow:

```javascript
// 1. Deploy contracts (already done)

// 2. Delegate voting power
await governanceToken.delegate(myAddress)

// 3. Create a proposal to withdraw 1 ETH from treasury
const proposal = await governor.propose(
  [treasuryAddress],
  [0],
  [withdrawCalldata],
  "Withdraw 1 ETH for development"
)

// 4. Wait for voting delay (1 block in default config)

// 5. Vote on the proposal
await governor.castVote(proposalId, 1) // 1 = For

// 6. Wait for voting period to end

// 7. Queue the proposal
await governor.queue(
  [treasuryAddress],
  [0],
  [withdrawCalldata],
  descriptionHash
)

// 8. Wait for timelock delay

// 9. Execute the proposal
await governor.execute(
  [treasuryAddress],
  [0],
  [withdrawCalldata],
  descriptionHash
)

// Done! Treasury funds are withdrawn ✅
```

## Need Help?

- 📖 Check the [full documentation](docs/)
- 🐛 [Report issues](https://github.com/yourrepo/issues)
- 💬 Ask in discussions
- 📧 Contact: your-email@example.com

## Project Structure

```
DAO/
├── contracts/           # Smart contracts
│   ├── GovernanceToken.sol
│   ├── DAOGovernor.sol
│   └── DAOTreasury.sol
├── scripts/            # Deployment & interaction scripts
├── test/              # Test files
├── frontend/          # Web interface
├── config/            # Configuration
├── docs/              # Documentation
└── hardhat.config.js  # Hardhat configuration
```

## Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Ethereum.org - DAOs](https://ethereum.org/en/dao/)
- [Solidity Documentation](https://docs.soliditylang.org/)

---

🎉 **Congratulations!** You now have a fully functional DAO!

Start building your decentralized community! 🚀
