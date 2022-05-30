//SPDX-License-Identifier:MIT
pragma solidity >=0.4.2 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract MarketPlace is ReentrancyGuard {
    address payable public immutable feeAccount; //the account that receive fees
    uint256 public immutable feePercentage; //the fee precentage on sales
    uint256 public itemCount;
    struct Item {
        uint256 id;
        IERC721 nft;
        uint256 tokenId;
        uint256 price;
        address payable seller;
        bool sold;
    }
    event Offered(
        uint256 itemId,
        address indexed nft,
        uint256 tokenId,
        uint256 price,
        address indexed seller
    );
    event Bought(
        uint256 itemId,
        address indexed nft,
        uint256 tokenId,
        uint256 price,
        address indexed seller,
        address indexed buyer
    );
    //ItemId=>Item
    mapping(uint256 => Item) public items;

    constructor(uint256 _feePercent) {
        feeAccount = payable(msg.sender);
        feePercentage = _feePercent;
    }

    //to list nft in market place
    function listItem(
        IERC721 _nft,
        uint256 _tokenId,
        uint256 _price
    ) external nonReentrant {
        require(_price > 0, "Price must be greater than 0");
        itemCount++;
        //transfer nft to marketplace
        _nft.transferFrom(msg.sender, address(this), _tokenId);

        //add new item to items mapping
        items[itemCount] = Item(
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );
        emit Offered(itemCount, address(_nft), _tokenId, _price, msg.sender);
    }

    function purchaseItem(uint256 _itemId) external payable nonReentrant {
        //get total price
        uint256 _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "Item doesn't exist");
        require(!item.sold, "Item is already sold");
        require(msg.value >= _totalPrice, "Insufficient funds");

        //pay seller and feeAccount(to marketplace)
        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);

        //update item to sold
        item.sold = true;

        //transfer nft to buyer
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        //emit bought event
        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );
    }

    function getTotalPrice(uint256 _itemId) public view returns (uint256) {
        //return total pice= price setBySeller + feePercentage
        uint256 sellerPrice = items[_itemId].price;
        uint256 feeCharges = (sellerPrice * feePercentage) / 100;
        return sellerPrice + feeCharges;
    }
}
