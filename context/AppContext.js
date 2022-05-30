import { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { MarketPlaceContractAddress, NftContractAdress } from "../utils/Constants";
import MarketPlace from "../utils/MarketPlace.json";
import NFT from "../utils/NFT.json";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [marketPlaceContract, setMarketPlaceContract] = useState(null);
  const [nftContract, setNftContract] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [nfts, setNfts] = useState([]);
  const [userNfts, setUserNfts] = useState([]);
  const [purchasedNfts, setPurchasedNfts] = useState([]);

  const web3Handler = async () => {
    const { ethereum } = window;
    if (ethereum) {
      //attach provider
      const provider = new ethers.providers.Web3Provider(ethereum);
      //fetch accounts
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAccount(accounts[0]);
      const signer = provider.getSigner();
      await loadContract(signer);
    }
  };

  const loadContract = async (signer) => {
    const marketPlace = new ethers.Contract(MarketPlaceContractAddress, MarketPlace.abi, signer);
    setMarketPlaceContract(marketPlace);
    const nft = new ethers.Contract(NftContractAdress, NFT.abi, signer);
    setNftContract(nft);
  };

  useEffect(() => {
    if (marketPlaceContract && nftContract) {
      fetchNfts();
    }
  }, [marketPlaceContract, nftContract]);

  const fetchNfts = async () => {
    const itemCount = await marketPlaceContract.itemCount();
    let items = [];
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketPlaceContract.items(i);
      if (!item.sold) {
        const uri = await nftContract.tokenURI(item.tokenId);
        //use uri to fetch the metadata stored in ipfs
        const response = await fetch(uri);
        const metadata = await response.json();
        //get total price of item
        const totalprice = await marketPlaceContract.getTotalPrice(item.id);
        items.push({
          totalprice,
          itemId: item.id,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
        });
      }
    }
    setNfts(items);
    setIsLoading(false);
  };

  const buyNft = async (item) => {
    try {
      console.log("buyNft", item);
      const tx = await marketPlaceContract.purchaseItem(item.itemId, { value: item.totalprice });
      console.log("still buying ");
      const receipt = await tx.wait();
      console.log(receipt);
      //remove that item from the list
      setNfts(nfts.filter((nft) => nft.itemId !== item.itemId));
    } catch (err) {
      console.log(err);
    }
  };

  const mintNft = async (item, price) => {
    try {
      const uri = "https://ipfs.infura.io/ipfs/" + item.path;
      //mint nft
      const tx = await nftContract.mint(uri);
      const receipt = await tx.wait();
      console.log("Minting NFT", receipt);
      //getting token id for new nft
      const id = await nftContract.tokenCount();
      //approve marketplace to spent nft
      await nftContract.setApprovalForAll(MarketPlaceContractAddress, true);
      //list nft to market place
      const listingPrice = ethers.utils.parseEther(price.toString());
      tx = await marketPlaceContract.listItem(nftContract.address, id, listingPrice);
      receipt = await tx.wait();
      console.log("Listing NFT", receipt);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserListedNfts = async () => {
    const itemCount = await marketPlaceContract.itemCount();
    let items = [];
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketPlaceContract.items(i);
      if (item.seller?.toLowerCase() === currentAccount?.toLowerCase()) {
        const uri = await nftContract.tokenURI(item.tokenId);
        //use uri to fetch the metadata stored in ipfs
        const response = await fetch(uri);
        const metadata = await response.json();
        //get total price of item
        const totalprice = await marketPlaceContract.getTotalPrice(item.id);
        items.push({
          totalprice,
          price: item.price,
          itemId: item.id,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          sold: item.sold,
          buyer: item.buyer ? item.buyer : null,
        });
      }
    }
    setIsLoading(false);
    setUserNfts(items);
  };

  const fetchUserPurchasedNfts = async () => {
    if (!currentAccount || !marketPlaceContract || !nftContract) return;
    try {
      const filter = marketPlaceContract.filters.Bought(null, null, null, null, null, currentAccount);
      const result = await marketPlaceContract.queryFilter(filter);

      const purchase = await Promise.all(
        result.map(async (i) => {
          //fetch args
          i = i.args;
          const uri = await nftContract.tokenURI(i.tokenId);
          const response = await fetch(uri);
          const metadata = await response.json();
          const totalprice = await marketPlaceContract.getTotalPrice(i.itemId);
          return {
            totalprice,
            price: i.price,
            itemId: i.itemId,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
          };
        })
      );
      setIsLoading(false);
      setPurchasedNfts(purchase);
    } catch (err) {
      console.log(err);
    }
  };

  return <AppContext.Provider value={{ currentAccount, isLoading, setIsLoading, currentPage, setCurrentPage, web3Handler, mintNft, nfts, fetchUserListedNfts, userNfts, purchasedNfts, fetchUserPurchasedNfts, buyNft }}>{children}</AppContext.Provider>;
};
