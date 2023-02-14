import { ethers } from "hardhat";

async function main() {
  const nft=0x0;// override with real contract address
  const MerkleAirDrop = await ethers.getContractFactory("MerkleAirDrop");
  const merkleAirDrop = await MerkleAirDrop.deploy(nft);

  await merkleAirDrop.deployed();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
