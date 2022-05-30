import React, { useContext } from "react";
import MarketPlace from "./MarketPlace";
import CreateNft from "./CreateNft";
import { AppContext } from "../context/AppContext";
import Purchase from "./Purchase";
import MyNfts from "./MyNfts";

const Main = () => {
  const { currentPage } = useContext(AppContext);
  if (currentPage == 0) return <MarketPlace />;
  else if (currentPage == 2) return <CreateNft />;
  else if (currentPage == 4) return <Purchase />;
  else if (currentPage == 3) return <MyNfts />;
  else <div>404</div>;
};

export default Main;
