import React, { useContext } from "react";
import { Button } from "@chakra-ui/react";
import { AppContext } from "../context/AppContext";

const style = {
  container: "flex flex-col w-full h-full mt-3 bg-white rounded-lg items-center justify-center",
  title: "text-center text-2xl font-bold text-gray-800",
};

const ConnectToWallet = ({ title }) => {
  const { setIsLoading, web3Handler } = useContext(AppContext);
  return (
    <div className={style.container}>
      <h2 className={style.title}>{title}</h2>
      <Button
        textColor={"white"}
        margin={"1rem"}
        background={"#AB46D2"}
        _hover={{ bg: "#c877e7" }}
        onClick={() => {
          setIsLoading(true);
          web3Handler();
        }}
      >
        Connect
      </Button>
    </div>
  );
};

export default ConnectToWallet;
