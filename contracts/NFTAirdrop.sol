// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity =0.8.17;

import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "erc721a/contracts/IERC721A.sol";

error AlreadyClaimed();
error InvalidProof();

contract NFTAirdrop is ERC721Holder, Ownable {
    bytes32 public merkleRoot;
    address public nft;

    //using bitmap dictionary to save gas 
    mapping(uint256 => uint256) private claimedBitMap;

    event Claimed(uint256 index, address account);

    constructor(address nft_) {
        nft = nft_;
    }

    function setMerkleRoot(bytes32 merkleRoot_) public onlyOwner {
        merkleRoot = merkleRoot_;
    }

    function isClaimed(uint256 index) public view returns (bool) {
        uint256 claimedWordIndex = index / 256;
        uint256 claimedBitIndex = index % 256;
        uint256 claimedWord = claimedBitMap[claimedWordIndex];
        uint256 mask = (1 << claimedBitIndex);
        return claimedWord & mask == mask;
    }

    function _setClaimed(uint256 index) private {
        uint256 claimedWordIndex = index / 256;
        uint256 claimedBitIndex = index % 256;
        claimedBitMap[claimedWordIndex] =
            claimedBitMap[claimedWordIndex] |
            (1 << claimedBitIndex);
    }

    function claim(
        uint256 tokenId,
        address account,
        bytes32[] calldata merkleProof
    ) public virtual {
        if (isClaimed(tokenId)) revert AlreadyClaimed();

        // Verify the merkle proof.
        bytes32 node = keccak256(abi.encodePacked(account,tokenId));
        if (!MerkleProof.verify(merkleProof, merkleRoot, node))
            revert InvalidProof();

        // Mark it claimed and send the token.
        _setClaimed(tokenId);
         IERC721A(nft).transferFrom(address(this),account, tokenId);

        emit Claimed(tokenId, account);
    }
}
