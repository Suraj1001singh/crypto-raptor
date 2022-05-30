import React, { useContext } from "react";
import { Button } from "@chakra-ui/react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BsBox } from "react-icons/bs";
import { FaVolleyballBall, FaRegListAlt } from "react-icons/fa";
import { MdLocalMall } from "react-icons/md";
import { AppContext } from "../context/AppContext";

const style = {
  container: "flex flex-col w-full h-full",
  sidebarTopBox: "flex flex-col w-full h-[200px] bg-[#AB46D2] rounded-lg",
  logoText: "text-white text-2xl font-bold text-center mt-[2rem]",
  logoSubText: "text-white text-sm  font-bold text-center ",
  menuItem: "flex flex-row align-center mx-[1rem] my-[1rem] p-[5px] font-bold text-1xl text-gray-800 cursor-pointer",
  menuIcon: "text-[#AB46D2] text-[20px] mr-[1rem] mt-[2px]",
};


const Sidebar = () => {

  const { setCurrentPage, currentAccount, web3Handler, setIsLoading } = useContext(AppContext);
  
  return (
    <div className={style.container}>
      <div className={style.sidebarTopBox}>
        <h1 className={style.logoText}>NFT Mall</h1>
        <h4 className={style.logoSubText}>Get Best selling NFT&apos;s</h4>
        {!currentAccount ? (
          <Button
            width={"fit-content"}
            margin="auto"
            textColor={"#AB46D2"}
            onClick={() => {
              setIsLoading(true);
              web3Handler();
            }}
          >
            Connect
          </Button>
        ) : (
          <>
            <h2 className={style.logoSubText}>Account</h2>
            <h4 className={style.logoSubText}>{[currentAccount.substring(0, 5), currentAccount.substring(currentAccount.length - 5, currentAccount.length)].join("....")}</h4>
          </>
        )}
      </div>
      <div>
        <div className={style.menuItem} onClick={() => setCurrentPage(0)}>
          <AiOutlineShoppingCart className={style.menuIcon} />
          Market
        </div>
        <div className={style.menuItem} onClick={() => setCurrentPage(1)}>
          <BsBox className={style.menuIcon} />
          Collections
        </div>
        <div className={style.menuItem} onClick={() => setCurrentPage(2)}>
          <FaVolleyballBall className={style.menuIcon} />
          Create NFT
        </div>
        <div className={style.menuItem} onClick={() => setCurrentPage(3)}>
          <FaRegListAlt className={style.menuIcon} />
          My NFT&apos;s
        </div>
        <div className={style.menuItem} onClick={() => setCurrentPage(4)}>
          <MdLocalMall className={style.menuIcon} />
          My Purchases
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
