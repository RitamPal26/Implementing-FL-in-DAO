# DAO (Decentralized Autonomous Organization)

A complete boilerplate for building a Decentralized Autonomous Organization with governance, voting, and treasury management.

## Features

- **Governance Token**: ERC20 token for voting rights
- **Treasury Management**: Safe handling of DAO funds
- **Proposal System**: Create and vote on proposals
- **Timelock Controller**: Delay execution for security
- **Upgradeable Contracts**: Future-proof architecture

## Project Structure

```
DAO/
├── contracts/              # Smart contracts
├── scripts/               # Deployment scripts
├── test/                  # Test files
├── frontend/              # Web interface
├── config/                # Configuration files
└── docs/                  # Documentation
```

## Getting Started

### Prerequisites

- Node.js >= 16.x
- npm or yarn
- MetaMask or compatible wallet

### Installation

```bash
npm install
```

### Compile Contracts

```bash
npx hardhat compile
```

### Run Tests

```bash
npx hardhat test
```

### Deploy

```bash
npx hardhat run scripts/deploy.js --network localhost
```

## Tech Stack

- Solidity
- Hardhat
- OpenZeppelin Contracts
- Ethers.js
- React (Frontend)
- Chai (Testing)

## License

MIT
