// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity =0.8.17;

import "erc721a/contracts/ERC721A.sol";

contract TestNFT is ERC721A {
    constructor() ERC721A("Test", "TST") {}

    function mintTo(address receiver, uint256 mintAmount) external {
        _safeMint(receiver, mintAmount);
    }
}
