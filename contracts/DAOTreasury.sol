// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DAOTreasury
 * @dev Simple treasury contract to hold DAO funds
 */
contract DAOTreasury is Ownable {
    event FundsReceived(address indexed from, uint256 amount);
    event FundsWithdrawn(address indexed to, uint256 amount);
    event FundsAllocated(address indexed to, uint256 amount, string purpose);

    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @dev Receive ETH into the treasury
     */
    receive() external payable {
        emit FundsReceived(msg.sender, msg.value);
    }

    /**
     * @dev Withdraw funds from treasury (only owner - should be Governor)
     * @param to Address to send funds to
     * @param amount Amount to withdraw
     */
    function withdraw(address payable to, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        to.transfer(amount);
        emit FundsWithdrawn(to, amount);
    }

    /**
     * @dev Allocate funds for a specific purpose
     * @param to Address to allocate funds to
     * @param amount Amount to allocate
     * @param purpose Description of the allocation
     */
    function allocateFunds(
        address payable to,
        uint256 amount,
        string memory purpose
    ) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        to.transfer(amount);
        emit FundsAllocated(to, amount, purpose);
    }

    /**
     * @dev Get the balance of the treasury
     * @return Balance of the treasury
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
