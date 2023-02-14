import { expect } from "chai";
import { ethers } from "hardhat";
import { utils } from "ethers";

import { MerkleTree } from "merkletreejs";

const STARTING_ID = 5;

describe("MerkleAirdrop", function () {
  let airdropAddresses = [
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  ].map((x, i) => {
    return { address: x, tokenId: i + STARTING_ID };
  });

  // equal to MerkleDistributor.sol #keccak256(abi.encodePacked(account, tokenId));
  const elements = airdropAddresses.map((x) =>
    utils.solidityKeccak256(["address", "uint256"], [x.address, x.tokenId])
  );

  it("should claim successfully for valid proof", async () => {
    const merkleTree = new MerkleTree(elements, utils.keccak256, {
      sort: true,
    });

    const root = merkleTree.getHexRoot();

    const leaf = elements[1];
    const proof = merkleTree.getHexProof(leaf);

    // Deploy contracts
    const TestNFT = await ethers.getContractFactory("TestNFT");
    const testNFT = await TestNFT.deploy();
    await testNFT.deployed();

    const NFTAirdrop = await ethers.getContractFactory("NFTAirdrop");
    const nftAirdrop = await NFTAirdrop.deploy(testNFT.address);
    await nftAirdrop.deployed();

    await testNFT.mintTo(nftAirdrop.address,100);
    await nftAirdrop.setMerkleRoot(root);

    // Attempt to claim and verify success
    await expect(
      nftAirdrop.claim(
        airdropAddresses[1].tokenId,
        airdropAddresses[1].address,
        proof
      )
    )
      .to.emit(nftAirdrop, "Claimed")
      .withArgs(airdropAddresses[1].tokenId,airdropAddresses[1].address);
  });

  it("should throw for invalid proof", async () => {
    const merkleTree = new MerkleTree(elements, utils.keccak256, {
      sort: true,
    });

    const root = merkleTree.getHexRoot();

    // Deploy contracts
    const TestNFT = await ethers.getContractFactory("TestNFT");
    const testNFT = await TestNFT.deploy();
    await testNFT.deployed();

    const NFTAirdrop = await ethers.getContractFactory("NFTAirdrop");
    const nftAirdrop = await NFTAirdrop.deploy(testNFT.address);
    await nftAirdrop.deployed();

    await testNFT.mintTo(nftAirdrop.address,100);
    await nftAirdrop.setMerkleRoot(root);

    // Attempt to claim and verify success
    await expect(
      nftAirdrop.claim(
        airdropAddresses[1].tokenId,
        airdropAddresses[1].address,
        []
      )
    ).to.be.revertedWithCustomError(
      nftAirdrop,
      "InvalidProof"
    );
  });
});
