import React, { useContext } from "react";
import Image from "next/image";
import { FaCoins } from "react-icons/fa";
import { ethers } from "ethers";
import { AppContext } from "../context/AppContext";

const style = {
  cardContainer: `flex flex-col basis-1/4`,
  card: `h-[200px] w-[190px] rounded-3xl flex cursor-pointer transition-all duration-300  hover:scale-105 hover:shadow-xl overflow-hidden  shadow-xl border-4 `,
  cardTitle: `text-[15px] font-bold flex text-center w-full flex-1 justify-center mt-[10px]`,
  price: `text-md font-bold flex justify-center items-center`,
  coins: `ml-[10px] mt`,
};

const Card = ({ item }) => {
  const { buyNft } = useContext(AppContext);
  return (
    <div className={style.cardContainer}>
      <div className={style.card} onClick={() => buyNft(item)}>
        <Image src={item.image} className="object-cover object-center" width={190} height={250}></Image>
      </div>
      <div>
        <div className={style.cardTitle}>{item.name}</div>
        <div className={style.price}>
          {ethers.utils.formatEther(item.totalprice.toString())} ETH <FaCoins className={style.coins} />
        </div>
      </div>
    </div>
  );
};

export default Card;
