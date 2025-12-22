# Frontend

Simple web interface for interacting with the DAO.

## Features

- Connect wallet (MetaMask)
- View token balance and voting power
- Delegate voting power
- Create proposals
- Vote on proposals
- View treasury balance

## Setup

1. Update `index.html` with your deployed contract addresses
2. Add contract ABIs from `artifacts/contracts/`
3. Serve the HTML file using a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server
```

4. Open http://localhost:8000 in your browser

## Integration

To fully integrate with your deployed contracts:

1. Export contract ABIs from Hardhat artifacts
2. Update contract addresses in the JavaScript
3. Implement the contract interaction functions
4. Test on a local network first

## Advanced Frontend

For a production-ready frontend, consider using:

- **React** or **Next.js** for component-based UI
- **ethers.js** or **wagmi** for Web3 integration
- **TailwindCSS** for styling
- **React Query** for data fetching
- **ConnectKit** or **RainbowKit** for wallet connection

Example structure:
```
frontend/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── App.jsx
├── public/
└── package.json
```
