const { expect } = require("chai");
const { ethers } = require("hardhat");
const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num);

describe("NFTMarketPlace", function () {
  let deployer,
    addr1,
    addr2,
    nft,
    marketPlace,
    feePercent = 1,
    URI = "sampleURI";

  beforeEach(async function () {
    const NFT = await ethers.getContractFactory("NFT");
    const MarketPlace = await ethers.getContractFactory("MarketPlace");
    [deployer, addr1, addr2] = await ethers.getSigners();

    nft = await NFT.deploy();
    await nft.deployed();
    marketPlace = await MarketPlace.deploy(feePercent);
    await marketPlace.deployed();
  });

  describe("Deployment", function () {
    it("Should track name and name of nft Collection", async function () {
      expect(await nft.name()).to.equal("NFT");
      expect(await nft.symbol()).to.equal("DRC");
    });

    it("Should track feeAccount and feePercentage of the marketPlace", async function () {
      expect(await marketPlace.feeAccount()).to.equal(deployer.address);
      expect(await marketPlace.feePercentage()).to.equal(feePercent);
    });
  });

  describe("Minting NFTs", function () {
    it("Should track each minted NFT", async () => {
      //addr1 mints NFT
      await nft.connect(addr1).mint(URI);
      expect(await nft.tokenCount()).to.equal(1);
      expect(await nft.balanceOf(addr1.address)).to.equal(1); //balance should be 1, because 1 nft is minted by addr1
      expect(await nft.tokenURI(1)).to.equal(URI);

      //addr2 mints NFT
      await nft.connect(addr2).mint(URI);
      expect(await nft.tokenCount()).to.equal(2);
      expect(await nft.balanceOf(addr2.address)).to.equal(1);
      expect(await nft.tokenURI(2)).to.equal(URI);
    });
  });

  describe("Listing nft in marketPlace", function () {
    beforeEach(async function () {
      //addr1 mints NFT
      await nft.connect(addr1).mint(URI);
      //addr1 approves authorize this marketplace to transfer sold items from your address to the buyer's address.
      await nft.connect(addr1).setApprovalForAll(marketPlace.address, true);
    });
    it("Should track newly created item, transfer NFT from seller to marketplace and emit Offered event", async function () {
      //addr1 offer their NFT at a price of 1ETH
      await expect(marketPlace.connect(addr1).listItem(nft.address, 1, toWei(1)))
        .to.emit(marketPlace, "Offered")
        .withArgs(1, nft.address, 1, toWei(1), addr1.address);
      //Owner of NFT should be now the marketPlace
      expect(await nft.ownerOf(1)).to.equal(marketPlace.address);
      //Item count should be now 1
      expect(await marketPlace.itemCount()).to.equal(1);

      //Get newly Created item from items mapping
      const item = await marketPlace.items(1);

      expect(item.id).to.equal(1);
      expect(item.tokenId).to.equal(1);
      expect(item.nft).to.equal(nft.address);
      expect(item.price).to.equal(toWei(1));
      expect(item.seller).to.equal(addr1.address);
      expect(item.sold).to.equal(false);
    });

    it("Should fail if the price is set to 0", async function () {
      await expect(marketPlace.connect(addr1).listItem(nft.address, 1, 0)).to.be.revertedWith("Price must be greater than 0");
    });
  });

  describe("Buying nft from marketPlace", function () {
    let price = 7,
      sellerInitailBalance,
      marketPlaceInitialBalance,
      itemTotalPrice;
    beforeEach(async function () {
      //addr1 mints NFT
      await nft.connect(addr1).mint(URI);
      //addr1 approves authorize this marketplace to transfer sold items from your address to the buyer's address.
      await nft.connect(addr1).setApprovalForAll(marketPlace.address, true);
      //addr1 offer their NFT at a price of 1ETH
      await marketPlace.connect(addr1).listItem(nft.address, 1, toWei(price));
    });
    it("Should purchase Item from market place and emit Bought event", async function () {
      const item = await marketPlace.items(1);
      itemTotalPrice = await marketPlace.getTotalPrice(item.id);
      sellerInitailBalance = await addr1.getBalance();
      buyerInitialBalance = await addr2.getBalance();
      marketPlaceInitialBalance = await deployer.getBalance();
      //addr2 buys the item from marketPlace
      await expect(marketPlace.connect(addr2).purchaseItem(1, { value: itemTotalPrice }))
        .to.emit(marketPlace, "Bought")
        .withArgs(1, item.nft, 1, toWei(price), item.seller, addr2.address);

      // sellerFinalBalance = await addr1.getBalance();
      // buyerFinalBalance = await addr2.getBalance();
      // marketPlaceFinalBalance = await deployer.getBalance();
      //Owner of NFT should be now the addr2
      expect(await nft.ownerOf(1)).to.equal(addr2.address);
      //addr2 should have the item in their balance
      expect(await nft.balanceOf(addr2.address)).to.equal(1);
      //addr1 seller should receive the price of the item
      expect(+fromWei(await addr1.getBalance())).to.equal(+fromWei(sellerInitailBalance) + +price);
      //marketPlace should  receive the feePercentage of the item
      const fee = (feePercent / 100) * price;
      //bug for price=2
      expect(+fromWei(await deployer.getBalance())).to.equal(+fromWei(marketPlaceInitialBalance) + +fee);

      //item with id 1 should be now sold
      const itemAfterPurchase = await marketPlace.items(1);
      expect(itemAfterPurchase.sold).to.equal(true);
    });

    it("Should fail for invalid id, sold item, not enought price is paid", async function () {
      await expect(marketPlace.connect(addr2).purchaseItem(2, { value: toWei(1) })).to.be.revertedWith("Item doesn't exist");
      // await expect(marketPlace.connect(addr2).purchaseItem(1, { value: toWei(price) })).to.be.revertedWith("Insufficient funds");
      await expect(marketPlace.connect(addr2).purchaseItem(1, { value: itemTotalPrice })).to.emit(marketPlace, "Bought");
      await expect(marketPlace.connect(addr1).purchaseItem(1, { value: itemTotalPrice })).to.be.revertedWith("Item is already sold");
    });
  });
});
