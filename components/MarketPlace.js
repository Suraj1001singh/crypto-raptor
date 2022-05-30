import Card from "./Card";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import ConnectToWallet from "./ConnectToWallet";

const style = {
  container: "flex flex-col w-full h-full mt-3 bg-white rounded-lg",
  containerHeading: "font-bold text-[20px] text-gray-800 p-3",
  nftContainer: "flex flex-row flex-wrap w-full h-full p-4",
  loadingAssetText: "text-center text-gray-400 font-bold text-[15px] align-center",
};

export default function MarketPlace() {
  
  const { nfts, currentAccount } = useContext(AppContext);

  if (!currentAccount) return <ConnectToWallet title={"Please connect your wallet !"} />;
  else
    return (
      <div className={style.container}>
        <h3 className={style.containerHeading}>NFT MarketPlace</h3>
        <div className={style.nftContainer}>{nfts.length != 0 ? nfts?.map((nft, index) => <Card key={index} item={nft} />) : <div className={style.loadingAssetText}>Loading....</div>}</div>
      </div>
    );
}
