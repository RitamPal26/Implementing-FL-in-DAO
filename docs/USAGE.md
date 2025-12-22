# DAO Usage Guide

## Getting Started

### 1. Installation

```bash
npm install
```

### 2. Compile Contracts

```bash
npx hardhat compile
```

### 3. Run Tests

```bash
npx hardhat test
```

### 4. Deploy to Local Network

Start a local node:
```bash
npx hardhat node
```

In another terminal, deploy:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

## Creating a Proposal

### Step 1: Prepare Your Proposal

A proposal consists of:
- **Targets**: Array of contract addresses to call
- **Values**: Array of ETH values to send (usually 0)
- **Calldatas**: Array of encoded function calls
- **Description**: Human-readable description

Example:
```javascript
const treasury = await ethers.getContractAt("DAOTreasury", treasuryAddress);

const transferCalldata = treasury.interface.encodeFunctionData("withdraw", [
  recipientAddress,
  ethers.parseEther("1.0")
]);

const targets = [treasuryAddress];
const values = [0];
const calldatas = [transferCalldata];
const description = "Proposal #1: Withdraw 1 ETH for marketing";
```

### Step 2: Submit Proposal

```javascript
const proposeTx = await governor.propose(
  targets,
  values,
  calldatas,
  description
);
const receipt = await proposeTx.wait();
const proposalId = receipt.logs[0].args.proposalId;
```

Requirements:
- Must have sufficient voting power (≥ proposal threshold)
- Tokens must be delegated before proposal block

### Step 3: Wait for Voting Delay

After submission, wait for the voting delay period to pass before voting begins.

## Voting on Proposals

### Check Proposal State

```javascript
const state = await governor.state(proposalId);
// 0 = Pending, 1 = Active, 2 = Canceled, etc.
```

### Cast Your Vote

Vote types:
- `0` = Against
- `1` = For  
- `2` = Abstain

```javascript
await governor.castVote(proposalId, 1); // Vote "For"
```

Or vote with reason:
```javascript
await governor.castVoteWithReason(proposalId, 1, "I support this proposal because...");
```

### Delegate Voting Power

To participate in governance, delegate your tokens:

```javascript
// Delegate to yourself
await governanceToken.delegate(yourAddress);

// Or delegate to someone else
await governanceToken.delegate(delegateAddress);
```

## Executing Proposals

### Step 1: Queue the Proposal

After voting succeeds:

```javascript
await governor.queue(
  targets,
  values,
  calldatas,
  ethers.keccak256(ethers.toUtf8Bytes(description))
);
```

### Step 2: Wait for Timelock

Wait for the timelock delay to pass.

### Step 3: Execute

```javascript
await governor.execute(
  targets,
  values,
  calldatas,
  ethers.keccak256(ethers.toUtf8Bytes(description))
);
```

## Example: Complete Proposal Flow

```javascript
// 1. Delegate voting power
await token.delegate(signerAddress);

// 2. Create proposal
const proposeTx = await governor.propose(targets, values, calldatas, description);
const receipt = await proposeTx.wait();
const proposalId = receipt.logs[0].args.proposalId;

// 3. Wait for voting delay
// ... wait for blocks to pass ...

// 4. Vote
await governor.castVote(proposalId, 1);

// 5. Wait for voting period
// ... wait for voting to end ...

// 6. Queue proposal
const descHash = ethers.keccak256(ethers.toUtf8Bytes(description));
await governor.queue(targets, values, calldatas, descHash);

// 7. Wait for timelock
// ... wait for timelock delay ...

// 8. Execute
await governor.execute(targets, values, calldatas, descHash);
```

## Common Operations

### Check Voting Power

```javascript
const votes = await governor.getVotes(address, blockNumber);
```

### Check Proposal Details

```javascript
const proposal = await governor.proposalVotes(proposalId);
console.log("For votes:", proposal.forVotes);
console.log("Against votes:", proposal.againstVotes);
console.log("Abstain votes:", proposal.abstainVotes);
```

### Treasury Operations

Fund the treasury:
```javascript
await signer.sendTransaction({
  to: treasuryAddress,
  value: ethers.parseEther("10.0")
});
```

Check treasury balance:
```javascript
const balance = await treasury.getBalance();
```

## Best Practices

1. **Always delegate before creating proposals**
2. **Write clear, detailed proposal descriptions**
3. **Test proposals on local network first**
4. **Allow sufficient time for community discussion**
5. **Monitor proposal states throughout lifecycle**
6. **Keep track of proposal IDs and hashes**
7. **Use multisig for initial admin operations**

## Troubleshooting

### "Insufficient voting power"
- Ensure you've delegated your tokens
- Check delegation happened before proposal block
- Verify you meet the proposal threshold

### "Proposal not active"
- Wait for voting delay to pass
- Check proposal hasn't expired
- Verify proposal state

### "Governor not proposer"
- Ensure timelock roles are set correctly
- Grant PROPOSER_ROLE to Governor
- Grant EXECUTOR_ROLE to Governor

## Advanced Topics

### Batching Operations

```javascript
const targets = [contractA.address, contractB.address];
const values = [0, 0];
const calldatas = [
  contractA.interface.encodeFunctionData("functionA", [args]),
  contractB.interface.encodeFunctionData("functionB", [args])
];
```

### Vote Delegation Patterns

- **Direct democracy**: Everyone delegates to themselves
- **Liquid democracy**: Users delegate to trusted representatives
- **Hybrid**: Mix of both approaches

### Off-chain Voting

For gas efficiency, consider:
- Snapshot voting for signaling
- On-chain execution only
- EIP-712 signatures for gasless voting
