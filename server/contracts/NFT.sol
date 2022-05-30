//SPDX-License-Identifier:MIT
pragma solidity >=0.4.2 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    uint256 public tokenCount;

    constructor() public ERC721("NFT", "DRC") {}

    function mint(string memory _tokenUrl) external returns (uint256) {
        tokenCount++;
        //mint new NFT
        _safeMint(msg.sender, tokenCount);
        //to set metadata of newly minted NFT
        _setTokenURI(tokenCount, _tokenUrl);
        return tokenCount;
    }
}
