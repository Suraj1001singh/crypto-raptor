import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { HashLoader } from "react-spinners";
import { ethers, logger } from "ethers";
import { FaEthereum } from "react-icons/fa";
import Image from "next/image";
import ConnectToWallet from "./ConnectToWallet";

const style = {
  container: "flex flex-col w-full h-full mt-3 bg-white rounded-lg",
  containerHeading: "font-bold text-[20px] text-gray-800 p-3",
  nftContainer: "flex flex-row flex-wrap w-full h-full p-4",
  card: `h-[200px] w-[190px] rounded-3xl flex cursor-pointer transition-all duration-300  hover:scale-105 hover:shadow-xl overflow-hidden  shadow-xl border-4 `,
  cardContainer: `flex flex-col basis-1/4`,
  cardTitle: `text-[15px] font-bold flex text-center w-full flex-1 justify-center mt-[10px]`,
  price: `text-md font-bold flex justify-center items-center`,
  loaderContainer: `w-full h-[500px] flex items-center justify-center `,
};

const MyNfts = () => {
  const { userNfts, fetchUserListedNfts, isLoading, currentAccount } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentAccount) {
      (async function () {
        await fetchUserListedNfts();

        setLoading(false);
      })();
    }
  }, [currentAccount]);

  if (!currentAccount) return <ConnectToWallet title={"Please connect your wallet !"} />;
  else
    return (
      <div className={style.container}>
        <h3 className={style.containerHeading}>My NFT's Collection</h3>
        <div className={style.nftContainer}>
          {loading || isLoading ? (
            <div className={style.loaderContainer}>
              <HashLoader className={style.loader} size={80} />
            </div>
          ) : (
            <>
              {userNfts.length == 0 ? (
                <div>You haven't created any NFT's</div>
              ) : (
                <>
                  {userNfts.map((item, index) => (
                    <div key={index} className={style.cardContainer}>
                      <div className={style.card}>
                        <Image src={item.image} className="object-cover object-center" width={190} height={250}></Image>
                      </div>
                      <div>
                        <div className={style.cardTitle}>{item.name}</div>
                        <div className={style.price}>
                          {ethers.utils.formatEther(item.totalprice.toString())} ETH <FaEthereum className={style.coins} />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    );
};

export default MyNfts;
