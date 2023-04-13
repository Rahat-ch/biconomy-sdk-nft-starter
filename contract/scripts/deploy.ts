import { ethers } from "hardhat";

async function main() {
  const Ticket = await ethers.getContractFactory("Ticket");
  const ticket = await Ticket.deploy();

  await ticket.deployed();

  console.log("Event Ticket NFT Contract deployed to:", ticket.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
